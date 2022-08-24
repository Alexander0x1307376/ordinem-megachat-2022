import { IConfigService } from "../../features/config/IConfigService";

export const configServiceMock: IConfigService = {
  get: jest.fn().mockImplementation(
    (param: string) => {
      const config = {
        'DB_HOST': 'localhost',
        'DB_PORT': '5442',
        'DB_USER': 'postgres',
        'DB_PASSWORD': 'secret',
        'DB_NAME': 'ordinem_megachat'
      } as Record<string, string>;
      return config[param];
    })
}