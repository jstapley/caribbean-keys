import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Use Resend's default sender until the domain is verified in Resend.
// Once caribbeankeysrealestate.com is added, update this to:
// 'Caribbean Keys <noreply@caribbeankeysrealestate.com>'
const FROM = 'Caribbean Keys <onboarding@resend.dev>'
const NOTIFY = process.env.NOTIFICATION_EMAIL!

// ── 1. New agent application → notify Ross ───────────────────────────────────
export async function sendAgentApplicationNotification(agent: {
  name: string
  email: string
  phone?: string | null
  company: string
}) {
  await resend.emails.send({
    from: FROM,
    to: NOTIFY,
    subject: `New Agent Application: ${agent.name} — ${agent.company}`,
    html: `
      <h2 style="color:#0a2342">New Agent Registration</h2>
      <p>A new agent has applied to join the Caribbean Keys referral programme.</p>
      <table cellpadding="6" style="border-collapse:collapse;width:100%;max-width:480px">
        <tr><td style="color:#666;width:120px">Name</td><td><strong>${agent.name}</strong></td></tr>
        <tr><td style="color:#666">Company</td><td>${agent.company}</td></tr>
        <tr><td style="color:#666">Email</td><td>${agent.email}</td></tr>
        <tr><td style="color:#666">Phone</td><td>${agent.phone || '—'}</td></tr>
      </table>
      <p style="margin-top:24px">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/agents"
           style="background:#c9a84c;color:#0a2342;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600">
          Review Application
        </a>
      </p>
    `,
  })
}

// ── 2. Agent approved → notify agent with referral code ─────────────────────
export async function sendAgentApprovalEmail(agent: {
  name: string
  email: string
  referral_code: string
}) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/agents/login`
  await resend.emails.send({
    from: FROM,
    to: agent.email,
    subject: 'Your Caribbean Keys Agent Registration is Approved',
    html: `
      <h2 style="color:#0a2342">Welcome to Caribbean Keys, ${agent.name}!</h2>
      <p>Your agent registration has been approved. You can now register your clients
         to protect your commission on Sugar Ridge sales.</p>
      <p style="margin:24px 0">
        <strong style="font-size:18px">Your referral code:</strong><br/>
        <span style="font-size:28px;font-weight:700;color:#c9a84c;letter-spacing:2px">${agent.referral_code}</span>
      </p>
      <h3 style="color:#0a2342">How it works</h3>
      <ol style="line-height:1.8">
        <li>Log in to your agent portal using the button below.</li>
        <li>Register each client you are actively working with.</li>
        <li>Upload proof of your communication (emails, documents, etc.).</li>
        <li>Your registration is timestamped — this protects your commission claim.</li>
      </ol>
      <p style="margin-top:24px">
        <a href="${portalUrl}"
           style="background:#c9a84c;color:#0a2342;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600">
          Log In to Agent Portal
        </a>
      </p>
      <p style="color:#999;font-size:12px;margin-top:32px">
        Caribbean Keys Real Estate &bull; Antigua, West Indies
      </p>
    `,
  })
}

// ── 3. New client registration → notify Ross ────────────────────────────────
export async function sendClientRegistrationNotification(params: {
  agentName: string
  agentEmail: string
  clientName: string
  clientEmail: string
  clientPhone?: string | null
  development: string
  notes?: string | null
  referralId: string
}) {
  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/agents`
  await resend.emails.send({
    from: FROM,
    to: NOTIFY,
    subject: `New Client Registration: ${params.clientName} via ${params.agentName}`,
    html: `
      <h2 style="color:#0a2342">New Client Registration</h2>
      <p><strong>${params.agentName}</strong> has registered a client for <strong>${params.development}</strong>.</p>
      <h3 style="color:#0a2342;margin-top:20px">Client Details</h3>
      <table cellpadding="6" style="border-collapse:collapse;width:100%;max-width:480px">
        <tr><td style="color:#666;width:120px">Name</td><td><strong>${params.clientName}</strong></td></tr>
        <tr><td style="color:#666">Email</td><td>${params.clientEmail}</td></tr>
        <tr><td style="color:#666">Phone</td><td>${params.clientPhone || '—'}</td></tr>
        <tr><td style="color:#666">Development</td><td>${params.development}</td></tr>
        ${params.notes ? `<tr><td style="color:#666">Notes</td><td>${params.notes}</td></tr>` : ''}
      </table>
      <h3 style="color:#0a2342;margin-top:20px">Agent</h3>
      <table cellpadding="6" style="border-collapse:collapse;width:100%;max-width:480px">
        <tr><td style="color:#666;width:120px">Name</td><td>${params.agentName}</td></tr>
        <tr><td style="color:#666">Email</td><td>${params.agentEmail}</td></tr>
      </table>
      <p style="color:#666;font-size:13px;margin-top:12px">Proof files are attached to this registration in the agent portal.</p>
      <p style="margin-top:24px">
        <a href="${adminUrl}"
           style="background:#c9a84c;color:#0a2342;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600">
          View in Admin
        </a>
      </p>
    `,
  })
}
