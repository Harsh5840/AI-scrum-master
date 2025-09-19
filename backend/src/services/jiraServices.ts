import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const JIRA_BASE_URL = process.env.JIRA_BASE_URL; // e.g., https://your-domain.atlassian.net
const JIRA_EMAIL = process.env.JIRA_EMAIL;       // Your Jira account email
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN; // Jira API token

const authHeader = {
  Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64")}`,
  "Content-Type": "application/json",
};

/**
 * Fetch backlog items from Jira
 */
export const fetchJiraBacklog = async () => {
  try {
    const response = await axios.get(`${JIRA_BASE_URL}/rest/api/3/search?jql=ORDER+BY+created DESC`, {
      headers: authHeader,
    });
    return response.data.issues;
  } catch (error) {
    console.error("Error fetching Jira backlog:", error);
    throw new Error("Failed to fetch Jira backlog");
  }
};

/**
 * Create a new Jira issue/ticket
 */
interface JiraTicket {
  summary: string;
  description?: string;
  issueType?: string;
}

export const createJiraIssue = async ({ summary, description, issueType }: JiraTicket) => {
  try {
    const data = {
      fields: {
        project: { key: process.env.JIRA_PROJECT_KEY }, // e.g., "PROJ"
        summary,
        description,
        issuetype: { name: issueType || "Task" },
      },
    };

    const response = await axios.post(`${JIRA_BASE_URL}/rest/api/3/issue`, data, {
      headers: authHeader,
    });

    return response.data;
  } catch (error : any) {
    console.error("Error creating Jira issue:", error.response?.data || error.message);
    throw new Error("Failed to create Jira ticket");
  }
};
