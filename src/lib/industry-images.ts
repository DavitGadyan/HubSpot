/** Default cover image per industry, used when a case study has no `image` of its own. Files live in /public/images/industries. */
const INDUSTRY_IMAGE: Record<string, string> = {
  "Manufacturing & Industry": "manufacturing",
  "Technology & Software": "technology",
  "Financial Services": "financial-services",
  "Education & Nonprofit": "education",
  "Lifestyle & Consumer": "consumer",
  "Logistics & Operations": "logistics",
  "Marketing & Communications": "marketing",
  "Real Estate & Property Management": "real-estate",
  "Health & Wellness": "health",
  "Healthcare & Insurance": "health",
};

export function industryImage(industry: string): string | undefined {
  const slug = INDUSTRY_IMAGE[industry];
  return slug ? `/images/industries/${slug}.jpg` : undefined;
}
