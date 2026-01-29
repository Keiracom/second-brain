# Agency OS Architecture

## What Is It?
Agency OS is a multi-channel client acquisition platform for Australian marketing agencies. Think "Bloomberg Terminal for Client Acquisition."

## The Stack
- **Backend:** FastAPI on Railway
- **Frontend:** Next.js on Vercel
- **Database:** Supabase PostgreSQL (AP-Southeast-1)
- **Orchestration:** Prefect (self-hosted on Railway)
- **Cache:** Upstash Redis

## Key Concepts

### ALS (Automated Lead Scoring)
Proprietary algorithm that scores leads 0-100:
- **Hot (85+):** Ready to engage, gets SDK treatment
- **Warm (60-84):** Promising, standard outreach
- **Cool (35-59):** Needs nurturing
- **Cold (<35):** Low priority

### Multi-Channel Outreach
Orchestrates across:
- Email (via Salesforge)
- SMS (via ClickSend/Twilio)
- Voice AI (via Vapi + ElevenLabs)
- LinkedIn (via Unipile)
- Direct mail

### The Salesforge Ecosystem
Three interconnected services:
1. **InfraForge** - Domain & mailbox management
2. **WarmForge** - Email warmup
3. **Salesforge** - Campaign sending

Key insight: Salesforge Pro ($40/mo) includes unlimited warmup.

## Business Model
- Target: Australian agencies with $30K-$300K monthly revenue
- Pricing: $2,500-$7,500 AUD/month
- Value prop: Meetings booked, not activities logged

## Related
- [[e2e-testing]]
- [[als-scoring]]
- [[salesforge-ecosystem]]
