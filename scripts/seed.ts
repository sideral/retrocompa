import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load .env.local file
config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface FamilyData {
  name: string;
  members: string[];
}

function parseNamesFile(filePath: string): FamilyData[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").map((line) => line.trim());
  const families: FamilyData[] = [];
  let currentFamily: FamilyData | null = null;

  for (const line of lines) {
    if (!line) {
      if (currentFamily) {
        families.push(currentFamily);
        currentFamily = null;
      }
      continue;
    }

    if (line.startsWith("Familia ")) {
      if (currentFamily) {
        families.push(currentFamily);
      }
      currentFamily = {
        name: line,
        members: [],
      };
    } else if (currentFamily) {
      currentFamily.members.push(line);
    }
  }

  if (currentFamily) {
    families.push(currentFamily);
  }

  return families;
}

async function seed() {
  console.log("Starting seed...");

  const filePath = path.join(process.cwd(), "names.txt");
  const familiesData = parseNamesFile(filePath);

  console.log(`Found ${familiesData.length} families`);

  // Insert families
  const familyMap = new Map<string, string>();

  for (const familyData of familiesData) {
    const { data, error } = await supabase
      .from("families")
      .insert({ name: familyData.name })
      .select()
      .single();

    if (error) {
      console.error(`Error inserting family ${familyData.name}:`, error);
      // Try to get existing family
      const { data: existing } = await supabase
        .from("families")
        .select()
        .eq("name", familyData.name)
        .single();
      if (existing) {
        familyMap.set(familyData.name, existing.id);
        console.log(`Using existing family: ${familyData.name}`);
      }
    } else if (data) {
      familyMap.set(familyData.name, data.id);
      console.log(`Inserted family: ${familyData.name}`);
    }
  }

  // Insert guests
  for (const familyData of familiesData) {
    const familyId = familyMap.get(familyData.name);
    if (!familyId) {
      console.error(`No family ID found for ${familyData.name}`);
      continue;
    }

    for (const memberName of familyData.members) {
      const { error } = await supabase.from("guests").insert({
        name: memberName,
        family_id: familyId,
      });

      if (error) {
        // Check if guest already exists
        const { data: existing } = await supabase
          .from("guests")
          .select()
          .eq("name", memberName)
          .eq("family_id", familyId)
          .single();

        if (!existing) {
          console.error(
            `Error inserting guest ${memberName} in ${familyData.name}:`,
            error
          );
        } else {
          console.log(`Guest already exists: ${memberName}`);
        }
      } else {
        console.log(`Inserted guest: ${memberName} (${familyData.name})`);
      }
    }
  }

  console.log("Seed completed!");
}

seed().catch(console.error);
