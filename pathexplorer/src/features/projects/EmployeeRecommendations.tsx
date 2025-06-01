import React, { useState } from 'react';
import { useGetRecommendations, RoleRecommendation, Candidate } from '@/features/projects/useGetRecommendations';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface EmployeeRecommendationsProps {
    projectId: string;
}

export const EmployeeRecommendations: React.FC<EmployeeRecommendationsProps> = ({ projectId }) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>(undefined);
  const { recommendations, allRoles, loading, error } = useGetRecommendations(projectId, selectedRoleId);

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-700 mt-6">
        {error}
      </div>
    );
  }

  const handleRoleChange = (value: string) => {
    setSelectedRoleId(value === 'all' ? undefined : value);
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Employee Recommendations</h2>
        <div className="w-64 flex justify-end">
          <Select onValueChange={handleRoleChange} defaultValue="all">
            <SelectTrigger className="cursor-pointer w-full">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">All Roles</SelectItem>
              {allRoles.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()} className="cursor-pointer">
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="shadow-md p-6">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-16 w-full" />
            </Card>
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <p className="text-gray-500">No recommendations available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((role) => (
            <RoleCard key={role.role_id} role={role} />
          ))}
        </div>
      )}
    </div>
  );
};

interface RoleCardProps {
    role: RoleRecommendation;
}

const RoleCard: React.FC<RoleCardProps> = ({ role }) => {
  const filteredCandidates = role.top_candidates.filter(
    (candidate) => candidate.match_percentage >= 10,
  );

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="flex justify-between mb-2">
        <h3 className="text-lg font-semibold">{role.name}</h3>
        <Badge variant="outline">
          {role.skills.length} skill{role.skills.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      <p className="text-sm text-gray-600 mb-4">{role.description}</p>

      <div className="mb-4">
        <h4 className="font-medium mb-2 text-sm text-gray-700">Required Skills:</h4>
        <div className="flex flex-wrap gap-2">
          {role.skills.map((skill, index) => (
            <div key={index} className="text-xs border rounded-full px-3 py-1">
              <span>{skill.skill_name} ({skill.level}%)</span>
            </div>
          ))}
        </div>
      </div>

      <h4 className="font-medium mb-2 text-sm text-gray-700">Top Candidates:</h4>
      {filteredCandidates.length === 0 ? (
        <p className="text-sm text-gray-500">No matching candidates found.</p>
      ) : (
        <div className="space-y-3">
          {filteredCandidates.map((candidate) => (
            <CandidateItem key={candidate.developer_id} candidate={candidate} />
          ))}
        </div>
      )}
    </Card>
  );
};

interface CandidateItemProps {
    candidate: Candidate;
}

const CandidateItem: React.FC<CandidateItemProps> = ({ candidate }) => {
  return (
    <div className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer">
      <div className="h-10 w-10 mr-3 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center">
        {candidate.name.charAt(0)}
        {candidate.last_name_1.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p className="font-medium">
            {candidate.name} {candidate.last_name_1} {candidate.last_name_2}
          </p>
          <Badge className="ml-2 bg-purple-600">
            {candidate.match_percentage}%
          </Badge>
        </div>
        <Progress
          value={candidate.match_percentage}
          className="h-2 mt-1 bg-purple-100 [&>div]:bg-purple-600"
        />
      </div>
    </div>
  );
};
