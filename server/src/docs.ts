import { pythonDocsBySkill } from "./data/python-docs.js";

/** Library docs (pandas, etc.) + static Python docs for OOPS, CP, Cryptograph (LSP-style). */
export const docData: Record<string, string> = {
    pandas:
        "Pandas is a fast, powerful, flexible and easy to use open source data analysis and manipulation tool.\n\nKey Concepts:\n- DataFrame: 2-dimensional labeled data structure.\n- Series: 1-dimensional labeled array.\n\nCommon Errors:\n- SettingWithCopyWarning: Modifying a slice of a DataFrame.\n- MergeError: Joining DataFrames with incompatible keys.",
    oops: pythonDocsBySkill.oops,
    cp: pythonDocsBySkill.cp,
    cryptography: pythonDocsBySkill.cryptography,
};
