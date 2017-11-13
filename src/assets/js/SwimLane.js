/**
 * 泳道线
 *
 * Author: w.m.
 * CreateDate：2016/12/09
 * History：
 */
function Swimlane () {
    var lane = new Object()

	/** 泳道最小宽度 */
    lane.MIN_WW = 100

	/** 权限组ID */
    lane.authorityGroupId = ''

	/** 泳道宽度 */
    lane.ww = 200

	/** 权限组 */
    lane.authorityGroup = null
    return lane
}
