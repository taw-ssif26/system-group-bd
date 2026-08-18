import nodemailer from 'nodemailer'

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  })
}

const FROM = process.env.EMAIL_FROM || 'noreply@systemgroupbd.com'
const ADMIN_TO = process.env.EMAIL_ADMIN_TO || ''

export async function sendInquiryNotification(data: {
  name: string; email: string; subject: string; message: string
}) {
  if (!ADMIN_TO || !process.env.EMAIL_USER) return
  try {
    await getTransporter().sendMail({
      from: FROM, to: ADMIN_TO,
      subject: `New Inquiry: ${data.subject}`,
      html: `<p><strong>From:</strong> ${data.name} (${data.email})</p>
             <p><strong>Subject:</strong> ${data.subject}</p>
             <p><strong>Message:</strong></p><p>${data.message.replace(/\n/g, '<br>')}</p>`,
    })
  } catch (err) { console.error('Email failed:', err) }
}

export async function sendApplicationNotification(data: {
  jobTitle: string; applicantName: string; applicantEmail: string
}) {
  if (!ADMIN_TO || !process.env.EMAIL_USER) return
  try {
    await getTransporter().sendMail({
      from: FROM, to: ADMIN_TO,
      subject: `New Application: ${data.jobTitle}`,
      html: `<p><strong>Applicant:</strong> ${data.applicantName} (${data.applicantEmail})</p>
             <p><strong>Applied for:</strong> ${data.jobTitle}</p>`,
    })
  } catch (err) { console.error('Email failed:', err) }
}
