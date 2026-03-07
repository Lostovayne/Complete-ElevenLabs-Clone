import { prisma } from "@/lib/db";

const Page = async () => {
  const voices = await prisma.voice.findMany();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Voices ({voices.length})</h1>
      <ul className="space-x-2">
        {voices.map((voice) => (
          <li key={voice.id} className="mb-0">
            <strong>{voice.name}</strong> - {voice.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
