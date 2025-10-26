import "dotenv/config";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { Project } from "@/models/Project";
import { Task } from "@/models/Task";
import bcrypt from "bcryptjs";

async function run() {
  await dbConnect();

  const email = "test@example.com";
  const password = "Test@123";
  const name = "Test User";

  let user = await User.findOne({ email });
  if (!user) {
    const passwordHash = await bcrypt.hash(password, 10);
    user = await User.create({ email, passwordHash, name });
  }

  // Create 2 projects with 3 tasks each
  for (let i = 1; i <= 2; i++) {
    const project = await Project.create({
      user: user._id,
      title: `Project ${i}`,
      description: `Description for project ${i}`,
      status: "active",
    });

    for (let j = 1; j <= 3; j++) {
      await Task.create({
        project: project._id,
        title: `Task ${j} for project ${i}`,
        description: "Dummy task",
        status: j === 3 ? "done" : j === 2 ? "in-progress" : "todo",
      });
    }
  }

  console.log("Seed completed.");
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
