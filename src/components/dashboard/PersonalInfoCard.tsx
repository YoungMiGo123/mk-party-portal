
import { useState } from "react";
import { Edit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { User } from "@/store/authStore";

interface PersonalInfoCardProps {
  user: User;
  formatDate: (dateString: string) => string;
}

const PersonalInfoCard = ({ user, formatDate }: PersonalInfoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="shadow-glass-sm">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Your personal details and membership information
          </CardDescription>
        </div>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit size={14} className="mr-1" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <EditProfileForm 
            user={user} 
            onCancel={() => setIsEditing(false)} 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-mkneutral-500 block mb-1">Full Name</label>
                <div className="font-medium">{user.name} {user.surname}</div>
              </div>
              <div>
                <label className="text-sm text-mkneutral-500 block mb-1">ID Number</label>
                <div className="font-medium">{user.idNumber.substring(0, 6)}******</div>
              </div>
              <div>
                <label className="text-sm text-mkneutral-500 block mb-1">Date of Birth</label>
                <div>{formatDate(user.dateOfBirth)}</div>
              </div>
              <div>
                <label className="text-sm text-mkneutral-500 block mb-1">Gender</label>
                <div>{user.gender}</div>
              </div>
              <div>
                <label className="text-sm text-mkneutral-500 block mb-1">Race</label>
                <div>{user.race}</div>
              </div>
              <div>
                <label className="text-sm text-mkneutral-500 block mb-1">Language</label>
                <div>{user.language}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-mkneutral-500 block mb-1">Email Address</label>
                <div>{user.email}</div>
              </div>
              <div>
                <label className="text-sm text-mkneutral-500 block mb-1">Cellphone</label>
                <div>{user.cellphone}</div>
              </div>
              <div>
                <label className="text-sm text-mkneutral-500 block mb-1">Physical Address</label>
                <div>{user.address}</div>
              </div>
              <div>
                <label className="text-sm text-mkneutral-500 block mb-1">Occupation</label>
                <div>{user.occupation || "-"}</div>
              </div>
              <div>
                <label className="text-sm text-mkneutral-500 block mb-1">Employment Status</label>
                <div>{user.employmentStatus}</div>
              </div>
              <div>
                <label className="text-sm text-mkneutral-500 block mb-1">Disability</label>
                <div>{user.disability || "None"}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
