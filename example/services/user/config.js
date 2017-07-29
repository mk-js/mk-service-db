
const config = (options) => {
	Object.assign(current, options)
	current.db = current.server.db
	return current
}

const current = {
	// myOptin: "initValue",
}

module.exports = Object.assign(config, {
	current,
})
