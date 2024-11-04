import * as fs from "fs"
import * as path from "path"

export const readUserData = () => {
    const dataPath = path.join(__dirname, `../../data/users.json`)
    const dataRead = fs.readFileSync(dataPath, "utf-8")
    const dataJSON = JSON.parse(dataRead)
    return dataJSON
}
export const writeUserData = (userData: any) => {
    const dataPath = path.join(__dirname, `../../data/users.json`)
    fs.writeFileSync(dataPath, userData)
}