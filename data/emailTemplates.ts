import type { EmailTemplate } from '~/types/email'
import { getWorkWeekRange, getLastWorkdayOfWeek } from '~/utils/dateUtils'

export const emailTemplates: EmailTemplate[] = [
  {
    id: 1,
    name: '会议邀请模板',
    title: '【会议邀请】项目周会',
    category: '工作',
    content: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>亲爱的团队成员：</p>
      <p>现定于明天下午14:00召开项目周会，请准时参加。</p>
      <p><strong>会议内容：</strong></p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>项目进度回顾</li>
        <li>问题讨论</li>
        <li>下周计划</li>
      </ul>
      <p>请各位准时参加！</p>
    </div>`
  },
  {
    id: 2,
    name: '问候模板',
    title: '问候邮件',
    category: '个人',
    content: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p style="margin-bottom: 16px;">亲爱的同事：</p>
      <p style="margin-bottom: 16px; text-indent: 2em;">
        希望这封邮件找到你时，你一切安好。祝工作顺利，身体健康！
      </p>
      <div style="margin-top: 24px; color: #666;">
        <p style="margin-bottom: 8px;">此致</p>
        <p style="margin-bottom: 0;">敬礼</p>
      </div>
    </div>`
  },
  {
    id: 3,
    name: '通知模板',
    title: '重要通知',
    category: '工作',
    content: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p style="margin-bottom: 16px;">各位同事：</p>
      <p style="margin-bottom: 16px;">现有重要事项通知如下：</p>
      <div style="background-color: #f8f9fa; padding: 16px; border-radius: 4px; margin: 16px 0;">
        <p style="margin-bottom: 8px;">1. 请相关同事知悉并按要求执行。</p>
        <p style="margin-bottom: 0;">2. 如有疑问，请及时反馈。</p>
      </div>
      <p style="color: #666; font-size: 14px; margin-top: 24px; text-align: right;">
        ——此为自动发送的通知邮件
      </p>
    </div>`
  },
  {
    id: 4,
    name: '私人模板',
    title: `DP工作周报-姓名 ${getWorkWeekRange()}`,
    category: '工作',
    content: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p style="margin-bottom: 16px;">本周工作内容如下：</p>
      <div style="background-color: #f8f9fa; padding: 16px; border-radius: 4px; margin: 16px 0;">
        <p style="margin-bottom: 12px;"><strong>1. 本周完成工作:</strong></p>
        <ul style="margin: 0 0 16px 20px; padding: 0;">
          <li style="margin-bottom: 8px;">项目A进展...</li>
          <li style="margin-bottom: 8px;">项目B情况...</li>
          <li style="margin-bottom: 8px;">日常工作...</li>
        </ul>
        <p style="margin-bottom: 12px;"><strong>2. 下周工作计划:</strong></p>
        <ul style="margin: 0 0 0 20px; padding: 0;">
          <li style="margin-bottom: 8px;">继续推进项目A...</li>
          <li style="margin-bottom: 8px;">开始项目C...</li>
          <li style="margin-bottom: 0;">其他工作安排...</li>
        </ul>
      </div>
      <p style="color: #666; font-size: 14px; margin-top: 24px; text-align: right;">
        汇报时间：${getLastWorkdayOfWeek()}
      </p>
    </div>`
  },
  {
    id: 5,
    name: '感谢信模板',
    title: '感谢信 - 项目支持',
    category: '正式',
    content: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p style="margin-bottom: 16px;">尊敬的<span style="color: #0066cc; font-weight: 500;">张经理</span>：</p>
      <p style="margin-bottom: 16px; text-indent: 2em;">
        非常感谢您在过去的项目中给予我们的大力支持和帮助。在您的专业指导下，我们成功地克服了诸多困难，按时完成了项目目标。
      </p>
      <p style="margin-bottom: 16px; text-indent: 2em;">
        您的专业知识和敬业精神给我们留下了深刻的印象，也为我们树立了良好的榜样。我们期待在未来的项目中能够继续得到您的支持和指导。
      </p>
      <div style="margin-top: 24px; color: #666;">
        <p style="margin-bottom: 8px;">此致</p>
        <p style="margin-bottom: 8px;">敬礼</p>
        <p style="margin-bottom: 0;">项目团队</p>
      </div>
    </div>`
  },
  {
    id: 6,
    name: '请假申请模板',
    title: '请假申请',
    category: '工作',
    content: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p style="margin-bottom: 16px;">尊敬的领导：</p>
      <p style="margin-bottom: 16px; text-indent: 2em;">
        我因<span style="color: #ff6600;">[个人原因]</span>需请假<span style="color: #ff6600;">[天数]</span>天，请假时间为<span style="color: #ff6600;">[起始日期]</span>至<span style="color: #ff6600;">[结束日期]</span>。
      </p>
      <p style="margin-bottom: 16px; text-indent: 2em;">
        请假期间，我的工作将由<span style="color: #ff6600;">[同事姓名]</span>代为处理。我将确保在休假前完成所有紧急任务，并在返岗后及时跟进相关工作。
      </p>
      <div style="background-color: #f8f9fa; padding: 16px; border-radius: 4px; margin: 16px 0;">
        <p style="margin-bottom: 8px;"><strong>联系方式：</strong><span style="color: #ff6600;">[电话号码]</span></p>
      </div>
      <p style="margin-bottom: 16px; text-indent: 2em;">
        恳请批准！
      </p>
      <div style="margin-top: 24px; text-align: right;">
        <p style="margin-bottom: 8px;">申请人：<span style="color: #ff6600;">[姓名]</span></p>
        <p style="margin-bottom: 0;">申请日期：<span style="color: #ff6600;">[日期]</span></p>
      </div>
    </div>`
  },
  {
    id: 7,
    name: '项目进度报告模板',
    title: '项目进度报告 - [项目名称]',
    category: '工作',
    content: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p style="margin-bottom: 16px;">各位项目相关人员：</p>
      <p style="margin-bottom: 16px;">
        现将<span style="color: #0066cc; font-weight: 500;">[项目名称]</span>的进度情况汇报如下：
      </p>
      <div style="background-color: #f8f9fa; padding: 16px; border-radius: 4px; margin: 16px 0;">
        <p style="margin-bottom: 12px;"><strong style="color: #0066cc;">1. 项目概况</strong></p>
        <ul style="margin: 0 0 16px 20px; padding: 0;">
          <li style="margin-bottom: 8px;">项目启动日期：<span style="color: #666;">[日期]</span></li>
          <li style="margin-bottom: 8px;">计划完成日期：<span style="color: #666;">[日期]</span></li>
          <li style="margin-bottom: 8px;">当前进度：<span style="color: #666;">[百分比]</span></li>
        </ul>
        
        <p style="margin-bottom: 12px;"><strong style="color: #0066cc;">2. 已完成工作</strong></p>
        <ul style="margin: 0 0 16px 20px; padding: 0;">
          <li style="margin-bottom: 8px;">[已完成的任务1]</li>
          <li style="margin-bottom: 8px;">[已完成的任务2]</li>
          <li style="margin-bottom: 8px;">[已完成的任务3]</li>
        </ul>
        
        <p style="margin-bottom: 12px;"><strong style="color: #0066cc;">3. 进行中工作</strong></p>
        <ul style="margin: 0 0 16px 20px; padding: 0;">
          <li style="margin-bottom: 8px;">[进行中的任务1] - 预计完成日期：[日期]</li>
          <li style="margin-bottom: 8px;">[进行中的任务2] - 预计完成日期：[日期]</li>
        </ul>
        
        <p style="margin-bottom: 12px;"><strong style="color: #0066cc;">4. 风险与问题</strong></p>
        <ul style="margin: 0 0 16px 20px; padding: 0;">
          <li style="margin-bottom: 8px;">[风险/问题1] - 解决方案：[方案描述]</li>
          <li style="margin-bottom: 8px;">[风险/问题2] - 解决方案：[方案描述]</li>
        </ul>
        
        <p style="margin-bottom: 12px;"><strong style="color: #0066cc;">5. 下一阶段计划</strong></p>
        <ul style="margin: 0 0 0 20px; padding: 0;">
          <li style="margin-bottom: 8px;">[计划任务1] - 计划完成日期：[日期]</li>
          <li style="margin-bottom: 8px;">[计划任务2] - 计划完成日期：[日期]</li>
          <li style="margin-bottom: 0;">[计划任务3] - 计划完成日期：[日期]</li>
        </ul>
      </div>
      <p style="margin-bottom: 16px;">
        如有任何问题或建议，请随时与项目组联系。
      </p>
      <div style="margin-top: 24px; color: #666; text-align: right;">
        <p style="margin-bottom: 8px;">项目负责人：[姓名]</p>
        <p style="margin-bottom: 0;">报告日期：[日期]</p>
      </div>
    </div>`
  },
  {
    id: 8,
    name: '培训通知模板',
    title: '【培训通知】[培训主题]',
    category: '工作',
    content: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p style="margin-bottom: 16px;">各位同事：</p>
      <p style="margin-bottom: 16px; text-indent: 2em;">
        为提升团队专业技能，公司将组织<span style="color: #0066cc; font-weight: 500;">[培训主题]</span>培训活动，现将相关事项通知如下：
      </p>
      <div style="background-color: #f8f9fa; padding: 16px; border-radius: 4px; margin: 16px 0;">
        <p style="margin-bottom: 12px;"><strong>培训信息：</strong></p>
        <ul style="margin: 0 0 16px 20px; padding: 0;">
          <li style="margin-bottom: 8px;"><strong>培训时间：</strong>[日期] [时间]</li>
          <li style="margin-bottom: 8px;"><strong>培训地点：</strong>[地点]</li>
          <li style="margin-bottom: 8px;"><strong>培训讲师：</strong>[讲师姓名及职位]</li>
          <li style="margin-bottom: 8px;"><strong>培训对象：</strong>[参训人员范围]</li>
          <li style="margin-bottom: 0;"><strong>培训内容：</strong>[简要培训内容描述]</li>
        </ul>
        
        <p style="margin-bottom: 12px;"><strong>培训要求：</strong></p>
        <ol style="margin: 0 0 0 20px; padding: 0;">
          <li style="margin-bottom: 8px;">请参训人员准时参加，不得无故缺席；</li>
          <li style="margin-bottom: 8px;">培训前请做好相关准备工作；</li>
          <li style="margin-bottom: 0;">培训结束后将进行考核评估。</li>
        </ol>
      </div>
      <p style="margin-bottom: 16px; text-indent: 2em;">
        如有特殊情况无法参加，请提前向[负责人]请假。
      </p>
      <div style="margin-top: 24px; color: #666; text-align: right;">
        <p style="margin-bottom: 8px;">[部门名称]</p>
        <p style="margin-bottom: 0;">[日期]</p>
      </div>
    </div>`
  }
] 