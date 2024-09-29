import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "~/components/ui/drawer";
import { toast } from "~/components/ui/use-toast";
import { Popover, PopoverContent } from "~/components/ui/popover";
import { config } from "~/config";
import { CopyIcon, SendIcon } from "lucide-react";
import { useUserStore } from "~/db/userStore";

export function generateReferralTelegramUrl(userId: number, text: string) {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(
    `https://t.me/${config.botName}/onboarding?startapp=${userId.toString()}`
  );
  return `https://t.me/share/url?text=${encodedText}&url=${encodedUrl}`;
}

export function generateReferralUrl(userId: number) {
  return `https://t.me/${config.botName}/onboarding?startapp=${userId}`;
}

export const InviteFriend = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const [open, setOpen] = useState<boolean>(false);

  const isMobile = true;
  const referralLink = generateReferralTelegramUrl(
    user.id,
    t("referral_invite_text")
  );

  const handleInvite = async () => {
    setOpen(true);
  };

  const handleCopy = async () => {
    const referralUrl = generateReferralUrl(user.id);
    await navigator.clipboard.writeText(referralUrl);

    toast({
      title: t("referral_link_copied"),
      duration: 2000,
    });
    setOpen(false);
  };

  return (
    <div>
      <Popover open={open && !isMobile} onOpenChange={setOpen}>
        <Button
          onClick={handleInvite}
          className={cn("gap-2", className)}
        >
          {t("referral_button")}
        </Button>
        <PopoverContent className="overflow-hidden">
          <div className="bg-card flex flex-col p-2 min-w-52">
            <Button
              variant="ghost"
              asChild
              size="sm"
              className="font-bold h-10 bg-transparent hover:bg-accent justify-start gap-3"
            >
              <Link target="_blank" to={referralLink}>
                <SendIcon className="w-5 h-5" />
                {t("send")}
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={handleCopy}
              size="sm"
              className="font-bold h-10 bg-transparent hover:bg-accent justify-start gap-3"
            >
              <CopyIcon className="w-5 h-5" />
              {t("copy_link")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {isMobile && (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader className="">
              <DrawerTitle className="font-display font-bold mb-4 text-center">
                {t("referral_button")}
              </DrawerTitle>
              <Button asChild variant="outline">
                <Link to={referralLink}>{t("referral_share")}</Link>
              </Button>
              <Button variant="outline" onClick={handleCopy}>
                {t("referral_copy_link")}
              </Button>
            </DrawerHeader>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="ghost">{t("close")}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};
