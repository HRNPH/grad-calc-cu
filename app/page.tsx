"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { gradeScale } from "@/lib/const/grade";
import { subjectList } from "@/lib/const/subject";
import { Trash2, Edit, Check } from "lucide-react";

type Subject = {
  name: string;
  grade: keyof typeof gradeScale;
  credits: number;
};

export default function GradeCalculator() {
  const [terms, setTerms] = useState<
    {
      name: string;
      subjects: Subject[];
      isEditing: boolean;
    }[]
  >([]);
  const [newTerm, setNewTerm] = useState("");

  useEffect(() => {
    const savedTerms = localStorage.getItem("gradeCalculatorTerms");
    if (savedTerms) {
      setTerms(JSON.parse(savedTerms));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("gradeCalculatorTerms", JSON.stringify(terms));
  }, [terms]);

  const addTerm = () => {
    if (newTerm.trim() === "") return;
    setTerms([...terms, { name: newTerm, subjects: [], isEditing: false }]);
    setNewTerm("");
  };

  const deleteTerm = (termIndex: number) => {
    const updatedTerms = terms.filter((_, index) => index !== termIndex);
    setTerms(updatedTerms);
  };

  const toggleEditTerm = (termIndex: number) => {
    setTerms((prevTerms) =>
      prevTerms.map((term, index) =>
        index === termIndex ? { ...term, isEditing: !term.isEditing } : term
      )
    );
  };

  const renameTerm = (termIndex: number, newName: string) => {
    setTerms((prevTerms) => {
      const updatedTerms = [...prevTerms];
      updatedTerms[termIndex].name = newName;
      return updatedTerms;
    });
  };

  const addSubject = (termIndex: number) => {
    const newSubjects = [...terms];
    newSubjects[termIndex].subjects.push({ name: "", grade: "A", credits: 3 });
    setTerms(newSubjects);
  };

  const updateSubject = (
    termIndex: number,
    subjectIndex: number,
    field: keyof Subject,
    value: string
  ) => {
    const newTerms = [...terms];
    (newTerms[termIndex].subjects[subjectIndex][field] as string | number) =
      field === "credits" ? parseFloat(value) : value;
    setTerms(newTerms);
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    terms.forEach((term) => {
      term.subjects.forEach((subject) => {
        if (gradeScale[subject.grade] !== null) {
          totalPoints += (gradeScale[subject.grade] ?? 0) * subject.credits;
          totalCredits += subject.credits;
        }
      });
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Grade Calculator</h1>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Enter Term Name"
          value={newTerm}
          onChange={(e) => setNewTerm(e.target.value)}
        />
        <Button onClick={addTerm}>Add Term</Button>
      </div>
      {terms.map((term, termIndex) => (
        <Card key={termIndex} className="mb-4 p-4">
          <div className="flex justify-between items-center">
            {term.isEditing ? (
              <Input
                value={term.name}
                onChange={(e) => renameTerm(termIndex, e.target.value)}
              />
            ) : (
              <h2 className="text-lg font-bold">{term.name}</h2>
            )}
            <div className="flex gap-2">
              <Button onClick={() => toggleEditTerm(termIndex)} variant="ghost">
                {term.isEditing ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Edit className="w-5 h-5" />
                )}
              </Button>
              <Button onClick={() => deleteTerm(termIndex)} variant="ghost">
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {term.subjects.map((subject, subjectIndex) => (
              <div key={subjectIndex} className="flex gap-2">
                <Input
                  list="subjects"
                  placeholder="Subject Name"
                  value={subject.name}
                  onChange={(e) =>
                    updateSubject(
                      termIndex,
                      subjectIndex,
                      "name",
                      e.target.value
                    )
                  }
                />
                <datalist id="subjects">
                  {subjectList.map((subject) => (
                    <option key={subject} value={subject} />
                  ))}
                </datalist>
                <Input
                  type="number"
                  placeholder="Credits"
                  value={subject.credits}
                  onChange={(e) =>
                    updateSubject(
                      termIndex,
                      subjectIndex,
                      "credits",
                      e.target.value
                    )
                  }
                />
                <Select
                  value={subject.grade}
                  onValueChange={(value) =>
                    updateSubject(termIndex, subjectIndex, "grade", value)
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    {subject.grade}
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(gradeScale).map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            <div className="flex justify-end mt-2">
              <Button onClick={() => addSubject(termIndex)}>Add Subject</Button>
            </div>
          </div>
        </Card>
      ))}
      <h2 className="text-lg font-bold mt-4">Current GPA: {calculateGPA()}</h2>
    </div>
  );
}
