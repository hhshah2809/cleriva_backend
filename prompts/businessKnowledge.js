/**
 * businessKnowledge.js
 * 
 * Simulated RAG knowledge base containing business coaching
 * principles, frameworks, and methodologies.
 * 
 * This is injected into the system prompt to give the AI
 * domain-specific expertise without needing a vector database.
 */

const businessKnowledge = {
  customerRetention: {
    title: 'Customer Retention Strategies',
    principles: [
      'Focus on customer lifetime value (CLV) rather than single transactions.',
      'Implement a Net Promoter Score (NPS) system to track customer satisfaction.',
      'Create a structured onboarding experience for new customers.',
      'Build loyalty programs that reward repeat business and referrals.',
      'Use the 80/20 rule: 80% of revenue often comes from 20% of customers.',
      'Reduce churn by proactively reaching out to at-risk customers.',
      'Collect and act on customer feedback within 48 hours.',
      'Personalize communication based on purchase history and preferences.',
    ],
  },

  leadership: {
    title: 'Leadership & Management',
    principles: [
      'Practice servant leadership — prioritize team growth and well-being.',
      'Set clear OKRs (Objectives and Key Results) for every quarter.',
      'Conduct weekly 1-on-1 meetings with direct reports.',
      'Create a culture of psychological safety where mistakes are learning opportunities.',
      'Lead by example — model the behaviors you expect from your team.',
      'Develop an accountability framework with clear ownership and deadlines.',
      'Invest in continuous learning and professional development.',
      'Make decisions using data, not just intuition.',
    ],
  },

  delegation: {
    title: 'Delegation & Team Empowerment',
    principles: [
      'Use the Eisenhower Matrix: delegate urgent but not important tasks.',
      'Hire for attitude and cultural fit; train for skills.',
      'Document all processes with SOPs (Standard Operating Procedures).',
      'Give team members autonomy with accountability.',
      'Build systems that work without your constant involvement.',
      'The $10/$100/$1000 framework: stop doing $10/hour tasks as a business owner.',
      'Cross-train team members to eliminate single points of failure.',
      'Use the RACI matrix for project clarity (Responsible, Accountable, Consulted, Informed).',
    ],
  },

  marketing: {
    title: 'Marketing & Brand Consistency',
    principles: [
      'Define your Unique Value Proposition (UVP) in one clear sentence.',
      'Maintain brand consistency across all channels and touchpoints.',
      'Follow the Rule of 7: prospects need 7+ touchpoints before converting.',
      'Build an email list — it is the most valuable marketing asset you own.',
      'Content marketing compounds over time. Invest in evergreen content.',
      'Track Customer Acquisition Cost (CAC) and aim for a 3:1 CLV:CAC ratio.',
      'Use the StoryBrand framework: make the customer the hero, not your brand.',
      'Test one marketing channel thoroughly before expanding to the next.',
    ],
  },

  financialTracking: {
    title: 'Financial Systems & Cash Flow',
    principles: [
      'Review financial statements monthly: P&L, Balance Sheet, Cash Flow.',
      'Maintain a 3-6 month cash reserve for business continuity.',
      'Separate personal and business finances completely.',
      'Track your break-even point and monitor it quarterly.',
      'Implement the Profit First methodology: pay yourself first.',
      'Negotiate payment terms with vendors — net 30/60 when possible.',
      'Review pricing annually — most SMEs undercharge by 15-30%.',
      'Automate invoicing and follow up on receivables within 48 hours.',
    ],
  },

  growth: {
    title: 'Business Growth & Scaling',
    principles: [
      'Validate demand before scaling — use the Lean Startup approach.',
      'Build scalable systems before hiring. People amplify systems.',
      'Focus on one core revenue stream until it is consistently profitable.',
      'Strategic partnerships can accelerate growth faster than ads.',
      'Map your customer journey and optimize each conversion point.',
      'Use the Ansoff Matrix for growth: market penetration, development, diversification.',
      'Track leading indicators (pipeline, leads) not just lagging ones (revenue).',
      'Plan for growth with a 90-day sprint framework.',
    ],
  },

  operations: {
    title: 'Operational Excellence',
    principles: [
      'Systematize everything: if you do it twice, create a process.',
      'Use the 5 Whys technique for root cause analysis.',
      'Implement daily standups or weekly team syncs for alignment.',
      'Measure what matters — define 3-5 KPIs per department.',
      'Automate repetitive tasks with technology where possible.',
      'Conduct quarterly business reviews with your team.',
      'Build a business that can operate without you for 2 weeks.',
      'Create decision-making frameworks so the team does not wait for you.',
    ],
  },
};

/**
 * Formats the knowledge base into a string for prompt injection
 */
export function getKnowledgeContext() {
  let context = '--- BUSINESS COACHING KNOWLEDGE BASE ---\n\n';

  for (const [, category] of Object.entries(businessKnowledge)) {
    context += `## ${category.title}\n`;
    category.principles.forEach((p) => {
      context += `• ${p}\n`;
    });
    context += '\n';
  }

  return context;
}

export default businessKnowledge;
