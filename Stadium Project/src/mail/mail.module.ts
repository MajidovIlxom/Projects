import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService )=> ({
        transport: {
          host: config.get<string>('MAILER_HOST'),
          secure: false,
          auth: {
            user: config.get<string>('MAILDEV_USER'),
            pass: config.get<string>('MAILDEV_PASS')
          },
        },
        defaults: {
          from: `"Stadium" <${config.get('MAILER_HOST')}>`,
        },
        template:{
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          templates: 'confirmation',
          options: {
            strict: true,
          },
        },
        }),
      inject: [ConfigService]
    }),
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
