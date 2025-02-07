import { RouteGuard, Route, Router } from "@paperbits/common/routing";
import { OfflineObjectStorage } from "@paperbits/common/persistence";
import { IViewManager } from "@paperbits/common/ui";
import { IPageService } from "@paperbits/common/pages";


export class UnsavedChangesRouteGuard implements RouteGuard {
    constructor(
        private readonly offlineObjectStorage: OfflineObjectStorage,
        private readonly viewManager: IViewManager,
        private readonly router: Router,
        private readonly pageService: IPageService
    ) { }

    public canActivate(route: Route): Promise<boolean> {
        return new Promise<boolean>(async (resolve) => {
            if (this.offlineObjectStorage.hasUnsavedChanges()) {
                const path = this.router.getPath();

                if (route.previous && route.previous.path === path) {
                    const page = await this.pageService.getPageByPermalink(path);

                    if (page && this.offlineObjectStorage.hasUnsavedChangesAt(page.contentKey)) {
                        const toast = this.viewManager.addToast("Unsaved changes", `You have unsaved changes. Do you want to save or discard them?`, [
                            {
                                title: "Save",
                                iconClass: "paperbits-check-2",
                                action: async (): Promise<void> => {
                                    this.offlineObjectStorage.saveChanges();
                                    this.viewManager.removeToast(toast);
                                    resolve(true);
                                }
                            },
                            {
                                title: "Discard",
                                iconClass: "paperbits-simple-remove",
                                action: async (): Promise<void> => {
                                    this.offlineObjectStorage.discardChanges();
                                    this.viewManager.removeToast(toast);
                                    resolve(true);
                                }
                            }
                        ]);
                    }
                    else {
                        resolve(true);
                    }
                }
            }
            else {
                resolve(true);
            }
        });
    }
}