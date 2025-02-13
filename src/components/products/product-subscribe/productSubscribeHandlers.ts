﻿import { IWidgetOrder, IWidgetHandler  } from "@paperbits/common/editing";
import { ProductSubscribeModel } from "./productSubscribeModel";

export class ProductSubscribeHandlers implements IWidgetHandler {
    public async getWidgetOrder(): Promise<IWidgetOrder> {
        const widgetOrder: IWidgetOrder = {
            name: "productSubscribe",
            displayName: "Product: Subscribe form",
            iconClass: "paperbits-cheque-3",
            requires: ["scripts"],
            createModel: async () => new ProductSubscribeModel()
        };

        return widgetOrder;
    }
}