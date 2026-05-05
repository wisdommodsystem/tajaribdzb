interface DiscordWidgetMember {
  id: string;
  username: string;
  discriminator?: string;
  status?: string;
  avatar_url?: string;
}

interface DiscordWidgetPayload {
  id: string;
  name: string;
  instant_invite?: string;
  presence_count?: number;
  members?: DiscordWidgetMember[];
}

interface DiscordInvitePayload {
  guild?: {
    id: string;
    name: string;
  };
  approximate_member_count?: number;
  approximate_presence_count?: number;
}

export interface DiscordServerStats {
  serverName: string;
  memberCount: number;
  onlineCount: number;
  inviteUrl: string;
  onlineMembers: OnlineMember[];
}

export interface OnlineMember {
  name: string;
  avatarUrl: string | null;
}

export async function getDiscordServerStats(): Promise<DiscordServerStats> {
  const guildId = process.env.DISCORD_GUILD_ID;
  const fallbackInvite = "https://discord.gg/qusXGtgK8j";
  const inviteCode = extractInviteCode(
    process.env.DISCORD_INVITE_URL || fallbackInvite
  );

  // First choice: invite endpoint with live counts. Works even without DISCORD_GUILD_ID.
  if (inviteCode) {
    try {
      const inviteResponse = await fetch(
        `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true&with_expiration=true`,
        { next: { revalidate: 120 } }
      );

      if (inviteResponse.ok) {
        const invitePayload =
          (await inviteResponse.json()) as DiscordInvitePayload;
        const resolvedGuildId = invitePayload.guild?.id || guildId;
        const onlineMembers = await fetchWidgetOnlineMembers(resolvedGuildId);

        return {
          serverName: invitePayload.guild?.name || "Wisdom Circle Community",
          memberCount: invitePayload.approximate_member_count ?? 0,
          onlineCount: invitePayload.approximate_presence_count ?? 0,
          inviteUrl: `https://discord.gg/${inviteCode}`,
          onlineMembers
        };
      }
    } catch {
      // fallback to widget fetch below
    }
  }

  if (!guildId) {
    return {
      serverName: "Wisdom Circle Community",
      memberCount: 0,
      onlineCount: 0,
      inviteUrl: fallbackInvite,
      onlineMembers: []
    };
  }

  try {
    const response = await fetch(
      `https://discord.com/api/guilds/${guildId}/widget.json`,
      { next: { revalidate: 120 } }
    );

    if (!response.ok) {
      throw new Error("Discord widget is unavailable");
    }

    const payload = (await response.json()) as DiscordWidgetPayload;
    const sampledMembers = payload.members?.length ?? 0;
    const onlineCount = payload.presence_count ?? sampledMembers;
    const onlineMembers = (payload.members ?? [])
      .filter((member) => !!member.username)
      .map((member) => ({
        name:
          member.discriminator && member.discriminator !== "0"
            ? `${member.username}#${member.discriminator}`
            : member.username,
        avatarUrl: member.avatar_url ?? null
      }))
      .slice(0, 20);

    return {
      serverName: payload.name || "Wisdom Circle Community",
      memberCount: Math.max(sampledMembers, onlineCount),
      onlineCount,
      inviteUrl: payload.instant_invite || fallbackInvite,
      onlineMembers
    };
  } catch {
    return {
      serverName: "Wisdom Circle Community",
      memberCount: 0,
      onlineCount: 0,
      inviteUrl: fallbackInvite,
      onlineMembers: []
    };
  }
}

function extractInviteCode(inviteUrl: string): string | null {
  try {
    const url = new URL(inviteUrl);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    return pathSegments[pathSegments.length - 1] || null;
  } catch {
    return null;
  }
}

async function fetchWidgetOnlineMembers(
  guildId?: string
): Promise<OnlineMember[]> {
  if (!guildId) {
    return [];
  }

  try {
    const response = await fetch(
      `https://discord.com/api/guilds/${guildId}/widget.json`,
      { next: { revalidate: 120 } }
    );

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as DiscordWidgetPayload;
    return (payload.members ?? [])
      .filter((member) => !!member.username)
      .map((member) => ({
        name:
          member.discriminator && member.discriminator !== "0"
            ? `${member.username}#${member.discriminator}`
            : member.username,
        avatarUrl: member.avatar_url ?? null
      }))
      .slice(0, 20);
  } catch {
    return [];
  }
}
