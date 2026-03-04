declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function pushToDataLayer(event: string, params?: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export function trackFunnelLoaded(urlParams: Record<string, string>) {
  pushToDataLayer("Funnel Loaded", {
    pageSlug: "funnel_start",
    ...urlParams,
  });
}

export function trackPageViewed(stepId: string, stepIndex: number, totalSteps: number) {
  pushToDataLayer(`Page Viewed: ${stepId}`, {
    pageId: stepId,
    pageName: stepId,
    pageIndex: stepIndex,
    totalPages: totalSteps,
    isLastPage: stepIndex === totalSteps - 1,
  });
}

export function trackCustomEvent(eventType: string, params?: Record<string, unknown>) {
  pushToDataLayer("send_to_analytics", {
    custom_event_params: {
      analytics_event_type: eventType,
      ...params,
    },
  });
}

export function trackLeadSubmitted(leadGrade: string, selectedClient: string) {
  pushToDataLayer("lead_submitted", {
    lead_grade: leadGrade,
    selected_client: selectedClient,
  });
}

export function trackCTCEvent(action: "displayed" | "clicked", phoneNumber: string) {
  pushToDataLayer(action === "displayed" ? "ctc_displayed" : "ctc_clicked", {
    ctc_number: phoneNumber,
  });
}
