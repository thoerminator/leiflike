"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { BusinessCard } from "@/components/experience/BusinessCard";
import { SiteNav } from "@/components/SiteNav";

// Reine Client-Experience — kein SSR für den Canvas
const Lichttisch = dynamic(
  () => import("@/components/experience/Lichttisch").then((m) => m.Lichttisch),
  { ssr: false }
);

export default function Home() {
  const router = useRouter();
  const [introDone, setIntroDone] = useState(false);
  const [liftoff, setLiftoff] = useState(false);

  return (
    <main data-hand-zone>
      <Lichttisch active={introDone} liftoff={liftoff} />
      <SiteNav
        mode="work"
        visible={introDone && !liftoff}
        onWork={() => {}}
        onAbout={() => {
          setLiftoff(true);
          setTimeout(() => router.push("/about"), 600);
        }}
      />
      <BusinessCard onIntroDone={() => setIntroDone(true)} />
    </main>
  );
}
