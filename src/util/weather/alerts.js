export function buildAlerts(alertsRaw) {
    if (!Array.isArray(alertsRaw)) return [];

    return alertsRaw.map((alert) => ({
        headline: alert?.headline ?? "",
        event: alert?.event ?? "",
        severity: alert?.severity ?? "",
        urgency: alert?.urgency ?? "",
        areas: alert?.areas ?? "",
        desc: alert?.desc ?? "",
        instruction: alert?.instruction ?? "",
        effective: alert?.effective ?? null,
        expires: alert?.expires ?? null,
    }));
}