export interface DiscordRoleInfo {
  id: string;
  name: string;
  color: string;
}

export interface DiscordMemberProfile {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  joinedAt: string | null;
  roles: DiscordRoleInfo[];
}

interface DiscordGuildRole {
  id: string;
  name: string;
  color: number;
  position: number;
}

interface DiscordGuildUser {
  id: string;
  username: string;
  discriminator?: string;
  avatar?: string | null;
  banner?: string | null;
  global_name?: string | null;
}

interface DiscordGuildMember {
  user: DiscordGuildUser;
  nick?: string | null;
  avatar?: string | null;
  banner?: string | null;
  roles: string[];
  joined_at?: string;
}

export async function getDiscordMemberProfile(
  discordUserId?: string
): Promise<DiscordMemberProfile | null> {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!guildId || !botToken || !discordUserId) {
    return null;
  }

  const headers = { Authorization: `Bot ${botToken}` };

  try {
    const [memberRes, rolesRes] = await Promise.all([
      fetch(
        `https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}`,
        { headers, cache: "no-store" }
      ),
      fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
        headers,
        cache: "no-store"
      })
    ]);

    if (!memberRes.ok) {
      console.error(`[Discord API Error] Member fetch failed: ${memberRes.status} ${memberRes.statusText}`);
      return null;
    }
    if (!rolesRes.ok) {
      console.error(`[Discord API Error] Roles fetch failed: ${rolesRes.status} ${rolesRes.statusText}`);
      return null;
    }

    const member = (await memberRes.json()) as DiscordGuildMember;
    const guildRoles = (await rolesRes.json()) as DiscordGuildRole[];
    const rolesById = new Map(guildRoles.map((role) => [role.id, role]));

    const mappedRoles = member.roles
      .filter((roleId) => roleId !== guildId)
      .map((roleId) => rolesById.get(roleId))
      .filter((role): role is DiscordGuildRole => Boolean(role))
      .sort((a, b) => b.position - a.position)
      .map((role) => ({
        id: role.id,
        name: role.name,
        color: role.color ? numberToHexColor(role.color) : "#9ca3af"
      }));

    const displayName =
      member.nick || member.user.global_name || member.user.username;

    const bannerUrl = member.user.banner 
      ? `https://cdn.discordapp.com/banners/${member.user.id}/${member.user.banner}.png?size=600`
      : null;

    return {
      id: member.user.id,
      displayName,
      username:
        member.user.discriminator && member.user.discriminator !== "0"
          ? `${member.user.username}#${member.user.discriminator}`
          : member.user.username,
      avatarUrl: resolveDiscordAvatar(guildId, member),
      bannerUrl,
      joinedAt: member.joined_at ?? null,
      roles: mappedRoles
    };
  } catch {
    return null;
  }
}

export async function updateDiscordMemberRole(
  discordUserId: string,
  roleId: string,
  action: "add" | "remove"
): Promise<boolean> {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!guildId || !botToken || !discordUserId || !roleId) {
    return false;
  }

  const headers = { Authorization: `Bot ${botToken}` };
  const method = action === "add" ? "PUT" : "DELETE";

  try {
    const url = `https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`;
    console.log(`Discord API Call: ${method} ${url}`);
    
    const response = await fetch(url, { method, headers });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Discord API Error [${response.status}]:`, errorData);
    }

    return response.ok;
  } catch (error) {
    console.error(`Failed to ${action} Discord role:`, error);
    return false;
  }
}

function numberToHexColor(value: number): string {
  return `#${value.toString(16).padStart(6, "0")}`;
}

function resolveDiscordAvatar(
  guildId: string,
  member: DiscordGuildMember
): string | null {
  if (member.avatar) {
    return `https://cdn.discordapp.com/guilds/${guildId}/users/${member.user.id}/avatars/${member.avatar}.png?size=128`;
  }
  if (member.user.avatar) {
    return `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=128`;
  }
  return null;
}
