import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Blocker detection patterns and keywords
const BLOCKER_PATTERNS = {
  dependency: [
    /blocked by/i,
    /waiting for/i,
    /depends on/i,
    /can't continue until/i,
    /need.*from/i,
    /waiting on/i,
    /dependency on/i,
    /stuck because/i
  ],
  technical: [
    /bug/i,
    /error/i,
    /issue/i,
    /problem/i,
    /broken/i,
    /failing/i,
    /not working/i,
    /technical.*issue/i,
    /environment.*down/i,
    /build.*fail/i
  ],
  resource: [
    /need.*help/i,
    /need.*resource/i,
    /missing.*access/i,
    /permission/i,
    /credential/i,
    /account/i,
    /license/i,
    /capacity/i
  ],
  external: [
    /third.*party/i,
    /external.*service/i,
    /api.*down/i,
    /vendor/i,
    /client.*approval/i,
    /stakeholder/i,
    /external.*dependency/i
  ]
};

const SEVERITY_KEYWORDS = {
  critical: [/critical/i, /urgent/i, /blocking.*everything/i, /showstopper/i],
  high: [/high.*priority/i, /major/i, /serious/i, /significant/i],
  medium: [/moderate/i, /medium/i, /important/i],
  low: [/minor/i, /low.*priority/i, /small/i]
};

export interface BlockerDetectionResult {
  type: string;
  severity: string;
  description: string;
  confidence: number;
}

export const detectBlockers = (text: string): BlockerDetectionResult[] => {
  const blockers: BlockerDetectionResult[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    
    // Check each blocker type
    for (const [type, patterns] of Object.entries(BLOCKER_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(trimmed)) {
          const severity = detectSeverity(trimmed);
          const confidence = calculateConfidence(trimmed, pattern);
          
          if (confidence > 0.3) { // Only include high-confidence detections
            blockers.push({
              type,
              severity,
              description: trimmed,
              confidence
            });
            break; // Don't double-count the same sentence
          }
        }
      }
    }
  }

  return deduplicateBlockers(blockers);
};

const detectSeverity = (text: string): string => {
  for (const [severity, patterns] of Object.entries(SEVERITY_KEYWORDS)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return severity;
      }
    }
  }
  return 'medium'; // Default severity
};

const calculateConfidence = (text: string, pattern: RegExp): number => {
  let confidence = 0.5; // Base confidence
  
  // Boost confidence for explicit blocker words
  if (/block|stuck|wait|issue|problem/i.test(text)) confidence += 0.2;
  
  // Boost for urgency indicators
  if (/urgent|critical|asap|immediately/i.test(text)) confidence += 0.1;
  
  // Boost for specific details
  if (text.length > 50) confidence += 0.1;
  
  // Reduce for vague language
  if (/maybe|might|possibly|potentially/i.test(text)) confidence -= 0.2;
  
  return Math.min(1.0, Math.max(0.0, confidence));
};

const deduplicateBlockers = (blockers: BlockerDetectionResult[]): BlockerDetectionResult[] => {
  const unique = [];
  const seen = new Set();
  
  for (const blocker of blockers) {
    const key = `${blocker.type}-${blocker.description.toLowerCase().slice(0, 50)}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(blocker);
    }
  }
  
  return unique.sort((a, b) => b.confidence - a.confidence);
};

export const saveBlockers = async (standupId: number, blockers: BlockerDetectionResult[]) => {
  const savedBlockers = [];
  
  for (const blocker of blockers) {
    const saved = await prisma.blocker.create({
      data: {
        standupId,
        type: blocker.type,
        severity: blocker.severity,
        description: blocker.description,
        status: 'active'
      }
    });
    savedBlockers.push(saved);
  }
  
  return savedBlockers;
};

export const getActiveBlockers = async (sprintId?: number) => {
  const where = sprintId 
    ? { standup: { sprintId }, status: 'active' }
    : { status: 'active' };
    
  return prisma.blocker.findMany({
    where,
    include: {
      standup: {
        include: {
          user: true,
          sprint: true
        }
      }
    },
    orderBy: [
      { severity: 'desc' },
      { detectedAt: 'desc' }
    ]
  });
};

export const resolveBlocker = async (blockerId: number) => {
  return prisma.blocker.update({
    where: { id: blockerId },
    data: {
      status: 'resolved',
      resolvedAt: new Date()
    }
  });
};

export const createBlocker = async (data: {
  description: string;
  severity: string;
  type?: string;
  standupId?: number;
}) => {
  return prisma.blocker.create({
    data: {
      description: data.description,
      severity: data.severity,
      type: data.type || 'manual',
      status: 'active',
      standupId: data.standupId
    }
  });
};