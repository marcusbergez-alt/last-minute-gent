type SearchParams = { email?: string };

export const metadata = {
  title: "Check je mail — Last-minute Gent",
};

export default async function CheckEmailPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const { email } = await props.searchParams;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-5 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-2xl">
        📬
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Check je e-mail
        </h1>
        <p className="text-sm text-zinc-600">
          {email ? (
            <>
              We hebben een inloglink gestuurd naar{" "}
              <span className="font-medium text-zinc-900">
                {decodeURIComponent(email)}
              </span>
              .
            </>
          ) : (
            <>We hebben je een inloglink gestuurd.</>
          )}{" "}
          Klik erop om je sessie te openen.
        </p>
        <p className="text-xs text-zinc-500">
          Niets ontvangen? Check je spam-folder of probeer opnieuw over een paar
          minuten.
        </p>
      </div>
    </main>
  );
}
