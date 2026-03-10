# Wostup Plan Feature Matrix

## Source of Truth
- Frontend feature flags live in [src/config/planFeatures.ts](../src/config/planFeatures.ts).
- Backend billing logic references the mirrored object in [../backend/config/planFeatures.js](../../backend/config/planFeatures.js).

These two files must stay in lockstep; any edits to one should be replicated in the other to avoid mismatched UI copy vs. payment enforcement.

## Feature Overview
| Capability | FREE (Community) | SPRINT_3MO (3-Month Cycle) | BUILDER_6MO (6-Month Cycle) | PARTNER_12MO (12-Month Cycle) |
| --- | --- | --- | --- | --- |
| Upfront Price (INR) | 0 | 4,500 | 8,400 | 14,400 |
| Max Active Jobs | 2 | 5 | 12 | 25 |
| Hiring Analytics | Basic | Advanced snapshots | Advanced + benchmarks | Full funnel |
| Bulk Email Outreach | Yes | Yes | Yes (with sequencing) | Yes (with personalization) |
| Job Analysis Insights | Basic | Basic | Advanced | Advanced |
| Social Recruiter Suite | No | Yes (Social Analysis) | No | Yes (Full Suite) |
| Interview Calendar | Yes | Yes | Yes | Yes |
| Priority Support Window | No | No | No | Yes |

> Note: The backend configuration also contains the amount (in paisa) that Razorpay should charge. Any change to pricing requires updating both the backend `amount` fields and the landing/plan selection UI copy so receipts and marketing stay aligned.

### Social Analysis Breakdown
- **Sprint · 3 Months**: Unlocks the Social Media Analysis page (`/startup/social-media-analysis`) so founders can review weekly engagement trends, post-type performance, and the benchmarked content table.
- **Partner · 12 Months**: Includes everything in Sprint plus planned personalization automation (social recruiter outreach, content scheduling, and additional analytics toggles).
- **Free / Builder**: Do not include social analysis today; those plans see the upgrade gate.

## Maintenance Checklist
1. Update both config files whenever a new capability or plan tier is introduced.
2. If you add a new feature key (e.g., `prioritySupport`), ensure it is handled in any plan-access middleware or entitlement checks.
3. Regenerate customer-facing copy (SelectPlanPage, marketing site) after modifying this matrix.
