interface DevProfilePageProps {
  params: Promise<{ username: string }>
}

export default async function DevProfilePage({ params }: DevProfilePageProps) {
  const { username } = await params

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold">Perfil: {username}</h1>
      <p className="mt-2 text-muted-foreground">Próximamente — Paso 7</p>
    </main>
  )
}
