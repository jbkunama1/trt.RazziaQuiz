import Card from "@razzia/web/components/Card"
import Reconnect from "@razzia/web/features/game/components/join/Reconnect"
import Room from "@razzia/web/features/game/components/join/Room"
import Username from "@razzia/web/features/game/components/join/Username"
import { usePlayerStore } from "@razzia/web/features/game/stores/player"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

// The upstream auth layout supplies the Razzia logo, background and branding.
const PlayerAuthPage = () => {
  const { inviteCode } = usePlayerStore()
  const { pin } = Route.useSearch()
  const [playerSelected, setPlayerSelected] = useState(false)

  // Preserve QR/invitation links and players who have already entered a PIN.
  if (playerSelected || pin || inviteCode) {
    return (
      <>
        {inviteCode ? <Username /> : <><Room /><Reconnect /></>}
        <a href="/" className="relative z-10 mt-6 rounded-lg px-4 py-2 text-sm font-semibold text-white/80 underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          Zur Startseite
        </a>
      </>
    )
  }

  return (
    <main className="relative z-10 mx-auto w-full max-w-3xl px-5 pb-20" aria-labelledby="entry-heading">
      <header className="mb-8 text-center text-white">
        <p className="text-primary mb-2 text-sm font-bold uppercase tracking-widest">Dein Live-Quiz</p>
        <h1 id="entry-heading" className="text-3xl font-bold sm:text-4xl">Wie möchtest du starten?</h1>
        <p className="mt-3 text-base text-white/75">Spiele mit oder leite die nächste Quizrunde.</p>
      </header>
      <div className="grid gap-5 sm:grid-cols-2">
        <Card className="h-full max-w-none p-6 sm:p-7">
          <div className="bg-primary/15 text-primary mb-5 flex h-14 w-14 items-center justify-center rounded-2xl" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M21 21v-2a6 6 0 0 0-4-5.65"/></svg>
          </div>
          <h2 className="text-foreground text-2xl font-bold">Spieler</h2>
          <p id="player-description" className="text-muted-foreground mt-2 mb-6 grow">Du hast eine Spiel-PIN? Tritt der Runde bei und zeig, was du weißt.</p>
          <button type="button" onClick={() => setPlayerSelected(true)} aria-describedby="player-description" className="bg-primary text-secondary w-full rounded-lg px-5 py-3 text-lg font-bold transition hover:brightness-105 active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            Jetzt mitspielen <span aria-hidden="true">→</span>
          </button>
        </Card>
        <Card className="h-full max-w-none p-6 sm:p-7">
          <div className="bg-secondary text-primary mb-5 flex h-14 w-14 items-center justify-center rounded-2xl" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="13" rx="2"/><path d="M8 21h8M12 16v5M9 7l6 3-6 3V7Z"/></svg>
          </div>
          <h2 className="text-foreground text-2xl font-bold">Moderator / Admin</h2>
          <p id="manager-description" className="text-muted-foreground mt-2 mb-6 grow">Wähle ein Quiz, eröffne eine Runde und übernimm die Spielleitung.</p>
          <a href="/manager" aria-describedby="manager-description" className="bg-secondary text-primary block w-full rounded-lg px-5 py-3 text-center text-lg font-bold transition hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            Quiz moderieren <span aria-hidden="true">→</span>
          </a>
        </Card>
      </div>
      <p className="mt-6 text-center text-sm text-white/65">Für die Spielleitung ist eine Anmeldung erforderlich.</p>
    </main>
  )
}

export const Route = createFileRoute("/(auth)/")({
  component: PlayerAuthPage,
})
