const express = require("express")
const cors = require("cors")

const activityRoutes = require("./modules/activities/activity.controller")
const territoryRoutes = require("./modules/territories/territory.controller")
const userRoutes = require("./modules/users/user.controller")


const app = express()

app.use(cors())
app.use(express.json())

app.use("/activity", activityRoutes)
app.use("/territories", territoryRoutes)
app.use("/users", userRoutes)


module.exports = app