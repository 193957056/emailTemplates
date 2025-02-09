/**
 * 获取本周工作日期范围（周一到周五）
 * @returns {string} 格式化的日期范围，如：2024.2.5-2024.2.9
 */
export function getWorkWeekRange() {
    const now = new Date()
    const currentDay = now.getDay() // 0 是周日，1-6 是周一到周六

    // 计算本周一的日期
    const monday = new Date(now)
    monday.setDate(now.getDate() - (currentDay === 0 ? 6 : currentDay - 1))

    // 计算本周五的日期
    const friday = new Date(monday)
    friday.setDate(monday.getDate() + 4)

    // 格式化日期
    const formatDate = (date: Date) => {
        return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
    }

    return `${formatDate(monday)}-${formatDate(friday)}`
}

/**
 * 获取本周最后一个工作日的日期
 * @returns {string} 格式化的日期，如：2024.2.9
 */
export function getLastWorkdayOfWeek() {
    const now = new Date()
    const currentDay = now.getDay()

    // 计算本周一的日期
    const monday = new Date(now)
    monday.setDate(now.getDate() - (currentDay === 0 ? 6 : currentDay - 1))

    // 计算本周五的日期
    const friday = new Date(monday)
    friday.setDate(monday.getDate() + 4)

    return `${friday.getFullYear()}.${friday.getMonth() + 1}.${friday.getDate()}`
} 