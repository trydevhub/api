import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaModule } from 'nestjs-prisma';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),

        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            imports: [ConfigModule],
            inject: [ConfigService],
            driver: ApolloDriver,
            useFactory: (configService: ConfigService) => ({
                playground: {
                    settings: {
                        'editor.theme': 'dark',
                        'editor.fontFamily': '"Fira Code", "MesloLGS NF", "Menlo", Consolas, "Courier New", monospace',
                        'editor.reuseHeaders': true,
                        'request.credentials': 'include'
                    }
                },
                introspection: true,
                path: configService.get<string>('GRAPHQL_ENDPOINT', '/'),
                installSubscriptionHandlers: true,
                autoSchemaFile: true,
                context: (
                    { req, res }: { req: Request; res: Response }
                ) => ({ headers: req.headers, req, res })
            })
        }),

        PrismaModule.forRoot({
            isGlobal: true
        }),

        AuthModule,

    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
