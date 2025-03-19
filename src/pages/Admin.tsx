
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, Download, User, Clock, Check, AlertTriangle, 
  CheckCircle, XCircle, Info, ChevronLeft, ChevronRight, Filter
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { mockMembers } from "@/lib/mockData";
import { User as UserType } from "@/store/authStore";

const Admin = () => {
  // State for member data and filtering
  const [members, setMembers] = useState<UserType[]>(mockMembers);
  const [filteredMembers, setFilteredMembers] = useState<UserType[]>(mockMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<UserType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAscending, setIsAscending] = useState(true);
  const itemsPerPage = 10;
  
  // Effect to filter members based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = members.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.idNumber.includes(searchTerm) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
      setCurrentPage(1);
    } else {
      setFilteredMembers(members);
    }
  }, [searchTerm, members]);
  
  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Sort members by date
  const sortMembers = () => {
    const sorted = [...filteredMembers].sort((a, b) => {
      const dateA = new Date(a.joinDate).getTime();
      const dateB = new Date(b.joinDate).getTime();
      return isAscending ? dateA - dateB : dateB - dateA;
    });
    setFilteredMembers(sorted);
    setIsAscending(!isAscending);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, filteredMembers.length - 1);
  const currentMembers = filteredMembers.slice(startIndex, endIndex + 1);
  
  // Export members
  const exportMembers = () => {
    alert("Exporting members data as CSV...");
    // In a real implementation, this would generate a CSV file
  };

  return (
    <div className="flex flex-col min-h-screen bg-mkneutral-50">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-mkneutral-900">
                  Admin Dashboard
                </h1>
                <p className="text-mkneutral-600 mt-2">
                  Manage members, view statistics, and more
                </p>
              </div>
              <Button 
                onClick={exportMembers}
                className="flex items-center"
              >
                <Download size={16} className="mr-2" />
                Export Members
              </Button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 shadow-glass-sm">
                <div className="flex items-center">
                  <div className="rounded-full bg-primary/10 p-3 mr-4">
                    <User size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-mkneutral-500 text-sm">Total Members</div>
                    <div className="text-2xl font-bold">{members.length}</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 shadow-glass-sm">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 p-3 mr-4">
                    <Clock size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-mkneutral-500 text-sm">New This Month</div>
                    <div className="text-2xl font-bold">12</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 shadow-glass-sm">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 p-3 mr-4">
                    <Check size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-mkneutral-500 text-sm">Verified Members</div>
                    <div className="text-2xl font-bold">{members.length}</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 shadow-glass-sm">
                <div className="flex items-center">
                  <div className="rounded-full bg-yellow-100 p-3 mr-4">
                    <AlertTriangle size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-mkneutral-500 text-sm">Pending Action</div>
                    <div className="text-2xl font-bold">0</div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Members Table */}
            <Card className="shadow-glass-sm overflow-hidden">
              <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-heading font-medium">Member List</h2>
                
                <div className="flex flex-col sm:flex-row gap-4 md:gap-2 w-full md:w-auto">
                  <div className="relative w-full sm:w-64 md:w-80">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mkneutral-400" />
                    <Input
                      type="text"
                      placeholder="Search members..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="pl-9"
                    />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Filter size={16} className="mr-2" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={sortMembers}>
                        Sort by Date {isAscending ? "↑" : "↓"}
                      </DropdownMenuItem>
                      <DropdownMenuItem>Filter by Province</DropdownMenuItem>
                      <DropdownMenuItem>Filter by Status</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="border-t">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">ID Number</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="hidden md:table-cell">Join Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentMembers.length > 0 ? (
                        currentMembers.map((member, index) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-mkneutral-200 mr-2 flex items-center justify-center">
                                  {member.photoUrl ? (
                                    <img 
                                      src={member.photoUrl} 
                                      alt={member.name} 
                                      className="w-full h-full rounded-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-xs font-medium">
                                      {member.name.charAt(0)}{member.surname.charAt(0)}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <div>{member.name} {member.surname}</div>
                                  <div className="text-xs text-mkneutral-500 md:hidden">
                                    {member.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell font-mono text-mkneutral-600">
                              {member.idNumber.substring(0, 6)}******
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{member.email}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatDate(member.joinDate)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle size={12} className="mr-1" />
                                  Active
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setSelectedMember(member)}
                                  >
                                    <Info size={16} />
                                    <span className="sr-only">View Details</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>Member Details</DialogTitle>
                                    <DialogDescription>
                                      Complete information about this member
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  {selectedMember && (
                                    <div className="mt-4 space-y-6">
                                      <div className="flex flex-col md:flex-row gap-6">
                                        <div className="md:w-1/3">
                                          <div className="aspect-square bg-mkneutral-100 rounded-lg flex items-center justify-center">
                                            {selectedMember.photoUrl ? (
                                              <img 
                                                src={selectedMember.photoUrl} 
                                                alt={selectedMember.name} 
                                                className="w-full h-full object-cover rounded-lg"
                                              />
                                            ) : (
                                              <div className="text-center text-mkneutral-400">
                                                <User size={64} className="mx-auto mb-2" />
                                                <div>No photo</div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        
                                        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <div className="text-mkneutral-500 text-sm">Full Name</div>
                                            <div className="font-medium">{selectedMember.name} {selectedMember.surname}</div>
                                          </div>
                                          <div>
                                            <div className="text-mkneutral-500 text-sm">ID Number</div>
                                            <div className="font-medium font-mono">{selectedMember.idNumber}</div>
                                          </div>
                                          <div>
                                            <div className="text-mkneutral-500 text-sm">Date of Birth</div>
                                            <div>{formatDate(selectedMember.dateOfBirth)}</div>
                                          </div>
                                          <div>
                                            <div className="text-mkneutral-500 text-sm">Gender</div>
                                            <div>{selectedMember.gender}</div>
                                          </div>
                                          <div>
                                            <div className="text-mkneutral-500 text-sm">Email</div>
                                            <div>{selectedMember.email}</div>
                                          </div>
                                          <div>
                                            <div className="text-mkneutral-500 text-sm">Cellphone</div>
                                            <div>{selectedMember.cellphone}</div>
                                          </div>
                                          <div>
                                            <div className="text-mkneutral-500 text-sm">Province</div>
                                            <div>{selectedMember.province}</div>
                                          </div>
                                          <div>
                                            <div className="text-mkneutral-500 text-sm">Ward</div>
                                            <div>{selectedMember.ward}</div>
                                          </div>
                                          <div>
                                            <div className="text-mkneutral-500 text-sm">Membership Type</div>
                                            <div>{selectedMember.membershipType}</div>
                                          </div>
                                          <div>
                                            <div className="text-mkneutral-500 text-sm">Membership Number</div>
                                            <div className="font-mono">{selectedMember.membershipNumber}</div>
                                          </div>
                                          <div>
                                            <div className="text-mkneutral-500 text-sm">Join Date</div>
                                            <div>{formatDate(selectedMember.joinDate)}</div>
                                          </div>
                                          <div>
                                            <div className="text-mkneutral-500 text-sm">Status</div>
                                            <div className="flex items-center">
                                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-mkneutral-500 text-sm">Address</div>
                                        <div className="p-3 bg-mkneutral-50 rounded-lg">
                                          {selectedMember.address}
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-mkneutral-500 text-sm">Audit Log</div>
                                        <div className="p-3 bg-mkneutral-50 rounded-lg space-y-2 text-sm">
                                          <div className="flex justify-between">
                                            <div className="flex items-center">
                                              <Check size={14} className="text-green-500 mr-2" />
                                              <span>Registration completed</span>
                                            </div>
                                            <div className="text-mkneutral-400">{formatDate(selectedMember.joinDate)}</div>
                                          </div>
                                          <div className="flex justify-between">
                                            <div className="flex items-center">
                                              <Check size={14} className="text-green-500 mr-2" />
                                              <span>Payment verified</span>
                                            </div>
                                            <div className="text-mkneutral-400">{formatDate(selectedMember.joinDate)}</div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="space-x-2 flex justify-end">
                                        <Button variant="outline">Edit Member</Button>
                                        <Button variant="destructive">
                                          <XCircle size={16} className="mr-2" />
                                          Deactivate
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-mkneutral-500">
                            No members found matching your search criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {/* Pagination */}
              {filteredMembers.length > 0 && (
                <div className="p-4 border-t flex items-center justify-between">
                  <div className="text-sm text-mkneutral-500">
                    Showing {startIndex + 1} to {Math.min(endIndex + 1, filteredMembers.length)} of {filteredMembers.length} members
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <div className="text-sm font-medium">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
