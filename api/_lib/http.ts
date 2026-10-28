export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

export function refuse(message: string, status = 400) {
  return json({ error: message }, status)
}

export function safely(handler: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    try {
      return await handler(request)
    } catch (failure) {
      const message = failure instanceof Error ? failure.message : String(failure)
      console.error(`${new URL(request.url).pathname}: ${message}`)
      return refuse(`Am Nordpol ist etwas schiefgegangen: ${message}`, 500)
    }
  }
}

export async function body(request: Request): Promise<Record<string, unknown>> {
  try {
    const parsed: unknown = await request.json()
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export function dayNumber(value: unknown) {
  const day = Number(value)
  return Number.isInteger(day) && day >= 1 && day <= 24 ? day : null
}
