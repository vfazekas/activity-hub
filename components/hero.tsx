export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-6 py-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.04] blur-3xl" />
        <div className="absolute left-[15%] top-[20%] h-32 w-32 rounded-full bg-foreground/[0.03] blur-2xl" />
        <div className="absolute bottom-[15%] right-[15%] h-40 w-40 rounded-full bg-foreground/[0.03] blur-2xl" />
      </div>

      {/* Decorative grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* Eyebrow */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/60 px-4 py-2 text-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-muted-foreground">
            Seu espaço de trabalho
          </span>
        </div>

        {/* Main title */}
        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
          Tudo que precisa acontecer.
          <br />
          <span className="text-muted-foreground">
            Em um só lugar.
          </span>
        </h1>

        {/* Description */}
        <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
          Organize suas tarefas, acompanhe projetos e mantenha seus
          acompanhamentos sob controle — sem perder o contexto do trabalho.
        </p>

        {/* CTA */}
        <div className="mt-10">
          <a
            href="/auth/login"
            className="group inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-all hover:gap-3 hover:opacity-90"
          >
            Acessar plataforma
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>

        {/* Floating workflow preview */}
        <div className="relative mt-20 w-full max-w-4xl">
          {/* Connection line */}
          <div className="absolute left-[10%] right-[10%] top-1/2 hidden h-px bg-foreground/10 md:block" />

          <div className="relative grid gap-4 md:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-2xl border border-foreground/10 bg-background/80 p-5 text-left shadow-2xl shadow-black/[0.03] backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Projeto
                </span>

                <span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs text-yellow-600 dark:text-yellow-400">
                  Em andamento
                </span>
              </div>

              <h3 className="font-medium">Online Service Booking</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Acompanhamento do rollout com os fornecedores.
              </p>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                <div className="h-full w-[68%] rounded-full bg-foreground/60" />
              </div>

              <div className="mt-2 text-xs text-muted-foreground">
                68% concluído
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-foreground/10 bg-background/80 p-5 text-left shadow-2xl shadow-black/[0.03] backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1 md:translate-y-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Tarefa
                </span>

                <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs text-blue-600 dark:text-blue-400">
                  Hoje
                </span>
              </div>

              <h3 className="font-medium">Validar conexão WebSocket</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Testes de estabilidade com os ambientes de produção.
              </p>

              <div className="mt-5 flex items-center gap-2">
                <div className="h-6 w-6 rounded-full border border-foreground/10 bg-foreground/5" />
                <span className="text-xs text-muted-foreground">
                  Próxima atividade
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-foreground/10 bg-background/80 p-5 text-left shadow-2xl shadow-black/[0.03] backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </span>

                <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs text-green-600 dark:text-green-400">
                  Concluído
                </span>
              </div>

              <h3 className="font-medium">Dashboard A3</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Atualização e acompanhamento dos indicadores.
              </p>

              <div className="mt-5 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 text-xs text-green-600 dark:text-green-400">
                  ✓
                </div>
                <span className="text-xs text-muted-foreground">
                  Finalizado
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}