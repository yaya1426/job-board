import OpenAI from "openai";
import { requireEnv } from "./utils";

export const openai = new OpenAI({
  apiKey: requireEnv("OPENAI_API_KEY"),
});

export const openaiModel = requireEnv("OPENAI_MODEL");