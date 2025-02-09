import type { EmailTemplate } from '~/types/email'

export const emailTemplates: EmailTemplate[] = [
  {
    id: 1,
    name: '会议邀请模板',
    title: '【会议邀请】项目周会',
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
    content: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p style="margin-bottom: 16px;">亲爱的同事：</p>
      <p style="margin-bottom: 16px;">
        希望这封邮件找到你时，你一切安好。
      </p>
      <p style="margin-bottom: 16px;">
        在此诚挚地向您致以问候，祝您工作顺利，身体健康！
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
  }
] 