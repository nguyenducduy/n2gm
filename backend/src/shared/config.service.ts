import { Injectable } from '@nestjs/common';
import * as convict from "convict";

const schema = convict({});
const config = schema.loadFile(`${process.cwd()}/appconfig.json`);

@Injectable()
export class ConfigService {
  get<T = any>(key: string): T {
    return config.get(key);
  }
}