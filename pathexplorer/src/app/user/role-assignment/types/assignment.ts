export interface Assignment {
  assignment_id:   number;
  request_date:    string;
  comments:        string;
  developer_id:    number;
  developer_name:  string;
  project_role_id: number | null;
  project_id:      number | null;
  project_name:    string;
}
