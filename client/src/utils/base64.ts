export const encodeString = (str: string): string => {
    return Buffer.from(str, "utf-8").toString("base64")
}

export const decodeString = (str: string): string => {
    return Buffer.from(str, 'base64').toString('utf-8')
}