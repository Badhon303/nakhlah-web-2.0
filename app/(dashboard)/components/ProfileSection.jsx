
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileSection() {
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Profile</h2>
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">Username</p>
          <p className="text-sm text-muted-foreground">Joined 2023</p>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-md font-semibold">Achievements</h3>
        <div className="flex space-x-2 mt-2">
          <span className="text-2xl">🏆</span>
          <span className="text-2xl">🏅</span>
        </div>
      </div>
      {/* Footer Links */}
      <div className="mt-6 pt-6 border-t border-border flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <a href="#" className="hover:text-foreground">About</a>
        <a href="#" className="hover:text-foreground">Blog</a>
        <a href="#" className="hover:text-foreground">Store</a>
        <a href="#" className="hover:text-foreground">Careers</a>
        <a href="#" className="hover:text-foreground">Terms</a>
        <a href="#" className="hover:text-foreground">Privacy</a>
      </div>
    </div>
  );
}
