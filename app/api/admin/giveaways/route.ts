import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Giveaway from "@/models/Giveaway";

export async function GET() {
  try {
    await connectToDatabase();
    const giveaways = await Giveaway.find({}).sort({ createdAt: -1 });
    return NextResponse.json(giveaways);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch giveaways" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { title, description, prize, endDate, winnersCount, imageUrl } = body;

    if (!title || !description || !prize || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newGiveaway = await Giveaway.create({
      title,
      description,
      prize,
      endDate: new Date(endDate),
      winnersCount: winnersCount || 1,
      imageUrl,
      status: "Active"
    });

    return NextResponse.json(newGiveaway, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create giveaway" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await Giveaway.findByIdAndDelete(id);
    return NextResponse.json({ message: "Giveaway deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete giveaway" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
    try {
      await connectToDatabase();
      const body = await request.json();
      const { id, status, drawWinners } = body;
  
      if (!id || !status) {
        return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
      }

      let updateData: any = { status };

      if (drawWinners && status === "Ended") {
        const giveaway = await Giveaway.findById(id);
        if (!giveaway) return NextResponse.json({ error: "Not found" }, { status: 404 });
        
        if (giveaway.participants.length > 0 && giveaway.winners.length === 0) {
          // Randomly pick winners
          const shuffled = [...giveaway.participants].sort(() => 0.5 - Math.random());
          const winners = shuffled.slice(0, giveaway.winnersCount || 1);
          updateData.winners = winners.map((w: any) => ({
            discordId: w.discordId,
            username: w.username,
            avatar: w.avatar
          }));

          // Send to Discord Webhook
          const webhookUrl = process.env.WINNER_WEBHOOK;
          if (webhookUrl) {
            try {
              await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  embeds: [{
                    title: "🎉 Giveaway Winners Drawn! 🎉",
                    description: `The winners for **${giveaway.title}** have been chosen!`,
                    color: 0x5865F2,
                    fields: [
                      {
                        name: "Prize",
                        value: giveaway.prize,
                        inline: true
                      },
                      {
                        name: "Winners",
                        value: updateData.winners.map((w: any) => `<@${w.discordId}> (${w.username})`).join("\n"),
                        inline: false
                      }
                    ],
                    thumbnail: giveaway.imageUrl ? { url: giveaway.imageUrl } : undefined,
                    timestamp: new Date().toISOString()
                  }]
                })
              });
            } catch (error) {
              console.error("Failed to send webhook:", error);
            }
          }
        }
      }
  
      const updatedGiveaway = await Giveaway.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
  
      return NextResponse.json(updatedGiveaway);
    } catch (error) {
      return NextResponse.json({ error: "Failed to update giveaway" }, { status: 500 });
    }
}
