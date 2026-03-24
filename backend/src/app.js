const express = require("express")
const cors = require("cors")

const activityRoutes = require("./modules/activities/activity.controller")
const territoryRoutes = require("./modules/territories/territory.controller")
const userRoutes = require("./modules/users/user.controller")


const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/activity", activityRoutes)
app.use("/api/territories", territoryRoutes)
app.use("/api/users", userRoutes)


module.exports = app