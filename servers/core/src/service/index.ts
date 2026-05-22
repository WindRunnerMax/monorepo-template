import { Injectable } from "@nestjs/common";
import { VERSION } from "@workspace/utils";

import type { IIndexResponse } from "../types";

@Injectable()
export class IndexService {
  public getIndex(): IIndexResponse {
    const now = Date.now();
    return { data: "Hello World", now, version: VERSION };
  }
}
