import {readJSON} from "./io";

export const readTestFile = (filePath: string) => {
    return readJSON(filePath);
};

export const readVMTests = (testDir: string) => {
    
};