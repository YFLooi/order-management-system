import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CreateGreeting from "@src/components/greeting-service/create-greeting";
import DisplayGreeting from "@src/components/greeting-service/display-greeting";
import GreetingService from "@src/components/greeting-service/greeting-service";

export default function Home() {
  const router = useRouter();
  const greetingService = new GreetingService();

  return (
    <div className="px-3 py-3">
      <h1>rxjs pub-sub demo</h1>
      <DisplayGreeting greetingService={greetingService} />
      <CreateGreeting greetingService={greetingService} />
    </div>
  );
}
