'use client';

import { useParams } from 'next/navigation';
import Animation from "@/components/cateogries/Animation";
import Crime from '@/components/cateogries/Crime';
import Documentry from '@/components/cateogries/Documentry';
import Drama from '@/components/cateogries/Drama';
import Scifi from '@/components/cateogries/Sci-fi';
import Action from '@/components/cateogries/Action';

export default function Page() {
  const params = useParams();
  const type = params.type as string;

  if (type === "animation") return <Animation />;
  if (type === "crime") return <Crime />;
  if (type === "documentry") return <Documentry />;
  if (type === "drama") return <Drama />;
  if (type === "sci-fi") return <Scifi />;
  if (type === "action") return <Action />;

  return <div className="text-white">Not Found</div>;
}