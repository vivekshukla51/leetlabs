import judge0Client from "./judge0Client.js";
import { Buffer } from "buffer";

export const getJudge0LanguageId = (language)=>{
    const languageMap = {
        "PYTHON":71,
        "JAVA":62,
        "JAVASCRIPT":63,
    }

    return languageMap[language.toUpperCase()]
}

const sleep  = (ms)=> new Promise((resolve)=> setTimeout(resolve , ms))

export const pollBatchResults = async (tokens) => {
    while (true) {
        const { data } = await judge0Client.get(`/submissions/batch`, {
            params: {
                tokens: tokens.join(","),
            },
        });
        const results = data.submissions.map((sub) => ({
            ...sub,
            stdout: sub.stdout ? Buffer.from(sub.stdout, "base64").toString("utf-8") : null,
            stderr: sub.stderr ? Buffer.from(sub.stderr, "base64").toString("utf-8") : null,
            compile_output: sub.compile_output ? Buffer.from(sub.compile_output, "base64").toString("utf-8") : null,
        }));
        const isAllDone = results.every((r) => r.status.id !== 1 && r.status.id !== 2);
        if (isAllDone) return results;
        await sleep(1000);
    }
};

export const submitBatch = async (submissions) => {
    // Base64 encode source_code, stdin, and expected_output
    const encodedSubmissions = submissions.map((sub) => ({
        ...sub,
        source_code: Buffer.from(sub.source_code).toString("base64"),
        stdin: sub.stdin ? Buffer.from(sub.stdin).toString("base64") : undefined,
        expected_output: sub.expected_output ? Buffer.from(sub.expected_output).toString("base64") : undefined,
    }));
    const { data } = await judge0Client.post(`/submissions/batch`, {
        submissions: encodedSubmissions,
    });
    console.log("Submission Results: ", data);
    return data; // [{token} , {token} , {token}]
};

export function getLanguageName(languageId){
    const LANGUAGE_NAMES = {
        74: "TypeScript",
        63: "JavaScript",
        71: "Python",
        62: "Java",
    }

    return LANGUAGE_NAMES[languageId] || "Unknown"
}