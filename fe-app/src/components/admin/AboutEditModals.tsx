import React, { useState } from 'react';
import { X, Plus, Trash2, Edit3, Save } from 'lucide-react';
import type { TeamMember } from '@/contexts/AboutContext';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const EditModal: React.FC<EditModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
}) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
            <div className='bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
                <div className='flex items-center justify-between p-6 border-b'>
                    <h2 className='text-xl font-semibold text-gray-800 dark:text-white'>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
                    >
                        <X className='w-5 h-5' />
                    </button>
                </div>
                <div className='p-6'>{children}</div>
            </div>
        </div>
    );
};

interface BasicSectionEditProps {
    title: string;
    description: string;
    onSave: (title: string, description: string) => void;
    onCancel: () => void;
}

export const BasicSectionEdit: React.FC<BasicSectionEditProps> = ({
    title,
    description,
    onSave,
    onCancel,
}) => {
    const [localTitle, setLocalTitle] = useState(title);
    const [localDescription, setLocalDescription] = useState(description);

    const handleSave = () => {
        onSave(localTitle, localDescription);
    };

    return (
        <div className='space-y-4'>
            <div>
                <label className='block text-sm font-medium mb-2'>
                    Tiêu đề
                </label>
                <input
                    type='text'
                    value={localTitle}
                    onChange={(e) => setLocalTitle(e.target.value)}
                    className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white'
                />
            </div>
            <div>
                <label className='block text-sm font-medium mb-2'>Mô tả</label>
                <textarea
                    value={localDescription}
                    onChange={(e) => setLocalDescription(e.target.value)}
                    rows={4}
                    className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white'
                />
            </div>
            <div className='flex gap-2 justify-end'>
                <button
                    onClick={onCancel}
                    className='px-4 py-2 text-gray-600 hover:text-gray-800'
                >
                    Hủy
                </button>
                <button
                    onClick={handleSave}
                    className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2'
                >
                    <Save className='w-4 h-4' />
                    Lưu
                </button>
            </div>
        </div>
    );
};

interface TeamMemberEditProps {
    members: TeamMember[];
    onAddMember: (member: Omit<TeamMember, 'id'>) => void;
    onUpdateMember: (id: number, member: Partial<TeamMember>) => void;
    onDeleteMember: (id: number) => void;
}

export const TeamMemberEdit: React.FC<TeamMemberEditProps> = ({
    members,
    onAddMember,
    onUpdateMember,
    onDeleteMember,
}) => {
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [newMember, setNewMember] = useState<Omit<TeamMember, 'id'>>({
        name: '',
        role: '',
        description: '',
        avatar: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        skills: [],
    });
    const [showAddForm, setShowAddForm] = useState(false);

    const handleUpdateMember = (
        memberData: Omit<TeamMember, 'id'> | TeamMember,
    ) => {
        if ('id' in memberData) {
            onUpdateMember(memberData.id, memberData);
            setEditingMember(null);
        }
    };

    const handleAddMember = (memberData: Omit<TeamMember, 'id'>) => {
        // Validation
        if (!memberData.name.trim()) {
            alert('Vui lòng nhập họ tên');
            return;
        }
        if (!memberData.role.trim()) {
            alert('Vui lòng nhập vai trò/MSSV');
            return;
        }
        if (!memberData.email.trim()) {
            alert('Vui lòng nhập email');
            return;
        }

        // Đặt avatar mặc định nếu không có
        const memberToAdd = {
            ...memberData,
            avatar: memberData.avatar.trim() || '/avatar.png', // fallback avatar
            description:
                memberData.description.trim() ||
                'Thành viên của đội ngũ Hotel Luxe',
            phone: memberData.phone.trim() || '+84 xxx xxx xxx',
        };

        onAddMember(memberToAdd);
        setNewMember({
            name: '',
            role: '',
            description: '',
            avatar: '',
            email: '',
            phone: '',
            linkedin: '',
            github: '',
            skills: [],
        });
        setShowAddForm(false);
    };

    const MemberForm = ({
        member,
        onSave,
        onCancel,
    }: {
        member: Omit<TeamMember, 'id'> | TeamMember;
        onSave: (member: Omit<TeamMember, 'id'> | TeamMember) => void;
        onCancel: () => void;
    }) => {
        const [formData, setFormData] = useState(member);
        const [skillInput, setSkillInput] = useState('');

        const addSkill = () => {
            if (
                skillInput.trim() &&
                !formData.skills.includes(skillInput.trim())
            ) {
                setFormData({
                    ...formData,
                    skills: [...formData.skills, skillInput.trim()],
                });
                setSkillInput('');
            }
        };

        const removeSkill = (skill: string) => {
            setFormData({
                ...formData,
                skills: formData.skills.filter((s) => s !== skill),
            });
        };

        return (
            <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium mb-2'>
                            Họ tên <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='text'
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            required
                            className='w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-2'>
                            Vai trò/MSSV <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='text'
                            value={formData.role}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    role: e.target.value,
                                })
                            }
                            required
                            className='w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                        />
                    </div>
                </div>

                <div>
                    <label className='block text-sm font-medium mb-2'>
                        Mô tả
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                        rows={3}
                        className='w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                    />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium mb-2'>
                            Email <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='email'
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            required
                            className='w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-2'>
                            Điện thoại
                        </label>
                        <input
                            type='text'
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    phone: e.target.value,
                                })
                            }
                            className='w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                        />
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium mb-2'>
                            LinkedIn
                        </label>
                        <input
                            type='text'
                            value={formData.linkedin || ''}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    linkedin: e.target.value,
                                })
                            }
                            className='w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-2'>
                            GitHub
                        </label>
                        <input
                            type='text'
                            value={formData.github || ''}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    github: e.target.value,
                                })
                            }
                            className='w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                        />
                    </div>
                </div>

                <div>
                    <label className='block text-sm font-medium mb-2'>
                        Avatar URL
                    </label>
                    <input
                        type='text'
                        value={formData.avatar}
                        onChange={(e) =>
                            setFormData({ ...formData, avatar: e.target.value })
                        }
                        placeholder='Ví dụ: /avatar.png hoặc https://example.com/avatar.jpg'
                        className='w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                    />

                    {/* Các avatar có sẵn */}
                    <div className='mt-2'>
                        <p className='text-sm text-gray-600 mb-2'>
                            Hoặc chọn avatar có sẵn:
                        </p>
                        <div className='flex gap-2 flex-wrap'>
                            {[
                                '/avatar.png',
                                '/tan.jpg',
                                '/hoang.jpg',
                                '/kha.png',
                                '/linh.jpg',
                                '/uyen.jpg',
                                '/cat1.jpg',
                                '/cat2.jpg',
                                '/cat3.jpg',
                                '/cat4.jpg',
                            ].map((avatarUrl) => (
                                <button
                                    key={avatarUrl}
                                    type='button'
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            avatar: avatarUrl,
                                        })
                                    }
                                    className={`w-12 h-12 rounded-full border-2 overflow-hidden ${
                                        formData.avatar === avatarUrl
                                            ? 'border-blue-500'
                                            : 'border-gray-300'
                                    }`}
                                >
                                    <img
                                        src={avatarUrl}
                                        alt='Avatar option'
                                        className='w-full h-full object-cover'
                                        onError={(e) => {
                                            e.currentTarget.src = '/avatar.png';
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {formData.avatar && (
                        <div className='mt-2'>
                            <p className='text-sm text-gray-600 mb-1'>
                                Preview:
                            </p>
                            <img
                                src={formData.avatar}
                                alt='Avatar preview'
                                className='w-16 h-16 rounded-full object-cover border'
                                onError={(e) => {
                                    e.currentTarget.src = '/avatar.png';
                                }}
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label className='block text-sm font-medium mb-2'>
                        Kỹ năng
                    </label>
                    <div className='flex gap-2 mb-2'>
                        <input
                            type='text'
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                            placeholder='Nhập kỹ năng...'
                            className='flex-1 p-2 border rounded-lg bg-white'
                        />
                        <button
                            type='button'
                            onClick={addSkill}
                            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                        >
                            <Plus className='w-4 h-4' />
                        </button>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        {formData.skills.map((skill, index) => (
                            <span
                                key={index}
                                className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2'
                            >
                                {skill}
                                <button
                                    onClick={() => removeSkill(skill)}
                                    className='text-blue-600 hover:text-blue-800'
                                >
                                    <X className='w-3 h-3' />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className='flex gap-2 justify-end'>
                    <button
                        onClick={onCancel}
                        className='px-4 py-2 text-gray-600 hover:text-gray-800'
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => {
                            // Validation trước khi save
                            if (!formData.name.trim()) {
                                alert('Vui lòng nhập họ tên');
                                return;
                            }
                            if (!formData.role.trim()) {
                                alert('Vui lòng nhập vai trò/MSSV');
                                return;
                            }
                            if (!formData.email.trim()) {
                                alert('Vui lòng nhập email');
                                return;
                            }

                            // Xử lý dữ liệu trước khi save
                            const processedData = {
                                ...formData,
                                avatar: formData.avatar.trim() || '/avatar.png',
                                description:
                                    formData.description.trim() ||
                                    'Thành viên của đội ngũ Hotel Luxe',
                                phone:
                                    formData.phone.trim() || '+84 xxx xxx xxx',
                            };

                            onSave(processedData);
                        }}
                        className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                    >
                        Lưu
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h3 className='text-lg font-semibold'>Quản lý thành viên</h3>
                <button
                    onClick={() => setShowAddForm(true)}
                    className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'
                >
                    <Plus className='w-4 h-4' />
                    Thêm thành viên
                </button>
            </div>

            {showAddForm && (
                <div className='border rounded-lg p-4 bg-gray-50'>
                    <h4 className='font-medium mb-4'>Thêm thành viên mới</h4>
                    <MemberForm
                        member={newMember}
                        onSave={handleAddMember}
                        onCancel={() => setShowAddForm(false)}
                    />
                </div>
            )}

            <div className='space-y-4'>
                {members.map((member) => (
                    <div key={member.id} className='border rounded-lg p-4'>
                        {editingMember?.id === member.id ? (
                            <MemberForm
                                member={editingMember}
                                onSave={handleUpdateMember}
                                onCancel={() => setEditingMember(null)}
                            />
                        ) : (
                            <div className='flex justify-between items-start'>
                                <div className='flex-1'>
                                    <h4 className='font-semibold'>
                                        {member.name}
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        {member.role}
                                    </p>
                                    <p className='text-sm mt-2'>
                                        {member.description}
                                    </p>
                                </div>
                                <div className='flex gap-2'>
                                    <button
                                        onClick={() => setEditingMember(member)}
                                        className='p-2 text-blue-600 hover:bg-blue-50 rounded'
                                    >
                                        <Edit3 className='w-4 h-4' />
                                    </button>
                                    <button
                                        onClick={() =>
                                            onDeleteMember(member.id)
                                        }
                                        className='p-2 text-red-600 hover:bg-red-50 rounded'
                                    >
                                        <Trash2 className='w-4 h-4' />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
