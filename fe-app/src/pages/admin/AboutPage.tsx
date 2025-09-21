import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Hotel,
    Users,
    Globe,
    Heart,
    Star,
    Award,
    Shield,
    Clock,
    Mail,
    Phone,
    Linkedin,
    Github,
    Edit,
    RotateCcw,
} from 'lucide-react';
import { useAbout } from '@/hooks/useAbout';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';
import {
    EditModal,
    BasicSectionEdit,
    TeamMemberEdit,
} from '@/components/admin/AboutEditModals';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
};

const AboutPage: React.FC = () => {
    const {
        aboutData,
        isLoading,
        updateAboutData,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        resetToDefault,
    } = useAbout();
    const { adminUser } = useAdminAuthStore();
    const [editModalOpen, setEditModalOpen] = useState<string | null>(null);

    const isAdmin = adminUser?.role === 'admin';

    // Handle edit states
    const handleSectionEdit = (
        section: string,
        title: string,
        description: string,
    ) => {
        if (!aboutData) return;

        const updatedData = { ...aboutData };

        switch (section) {
            case 'hero':
                updatedData.heroSection = { title, description };
                break;
            case 'mission':
                updatedData.mission = { title, description };
                break;
            case 'services':
                updatedData.services = {
                    ...updatedData.services,
                    title,
                    subtitle: description,
                };
                break;
            case 'team':
                updatedData.team = {
                    ...updatedData.team,
                    title,
                    subtitle: description,
                };
                break;
            case 'values':
                updatedData.values = { ...updatedData.values, title };
                break;
        }

        updateAboutData(updatedData);
        setEditModalOpen(null);
    };

    // Handle reset to default
    const handleResetToDefault = async () => {
        if (
            window.confirm(
                'Bạn có chắc chắn muốn khôi phục tất cả thông tin về mặc định? Tất cả thay đổi sẽ bị mất!',
            )
        ) {
            try {
                await resetToDefault();
                alert('Đã khôi phục thành công về thông tin mặc định!');
            } catch (error) {
                console.error('Error resetting to default:', error);
                alert('Có lỗi xảy ra khi khôi phục. Vui lòng thử lại!');
            }
        }
    };

    if (isLoading || !aboutData) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    const { heroSection, mission, services, team, values } = aboutData;

    // Map icon components
    const serviceIcons: Record<
        string,
        React.ComponentType<{ className?: string }>
    > = {
        booking: Hotel,
        management: Users,
        security: Shield,
        support: Clock,
    };

    const valueIcons: Record<
        string,
        React.ComponentType<{ className?: string }>
    > = {
        quality: Award,
        customer: Users,
        innovation: Globe,
    };

    const valueColors: Record<string, string> = {
        blue: 'from-blue-500 to-blue-600',
        purple: 'from-purple-500 to-purple-600',
        green: 'from-green-500 to-green-600',
    };

    return (
        <div className='relative smin-h-screen max-w-7xl flex items-center mx-auto bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
            {/* Reset Button - Fixed position at top left */}
            {isAdmin && (
                <button
                    onClick={handleResetToDefault}
                    className='absolute top-4 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all duration-200 hover:scale-105'
                    title='Khôi phục về mặc định'
                >
                    <RotateCcw className='w-5 h-5' />
                    <span className='hidden sm:inline'>Khôi phục</span>
                </button>
            )}

            <motion.div
                className='container mx-auto px-4 py-16'
                variants={containerVariants}
                initial='hidden'
                animate='visible'
            >
                {/* Hero Section */}
                <motion.div
                    className='text-center mb-20 relative'
                    variants={itemVariants}
                >
                    {isAdmin && (
                        <button
                            onClick={() => setEditModalOpen('hero')}
                            className='absolute top-0 right-0 p-2 text-blue-600 hover:bg-blue-50 rounded-lg'
                            title='Chỉnh sửa Hero Section'
                        >
                            <Edit className='w-5 h-5' />
                        </button>
                    )}

                    <motion.h1
                        className='text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6'
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        {heroSection.title}
                    </motion.h1>
                    <motion.p
                        className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed'
                        variants={itemVariants}
                    >
                        {heroSection.description}
                    </motion.p>
                </motion.div>

                {/* Mission Section */}
                <motion.section
                    className='mb-20 relative'
                    variants={itemVariants}
                >
                    {isAdmin && (
                        <button
                            onClick={() => setEditModalOpen('mission')}
                            className='absolute top-0 right-0 p-2 text-blue-600 hover:bg-blue-50 rounded-lg z-10'
                            title='Chỉnh sửa Mission'
                        >
                            <Edit className='w-5 h-5' />
                        </button>
                    )}

                    <Card className='bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-2xl'>
                        <CardHeader className='text-center pb-8'>
                            <motion.div
                                className='flex justify-center mb-4'
                                whileHover={{
                                    rotate: [0, 10, -10, 10, -10, 0],
                                    scale: 1.1,
                                }}
                                transition={{ duration: 0.8 }}
                            >
                                <Heart className='w-16 h-16 text-red-500' />
                            </motion.div>
                            <CardTitle className='text-3xl font-bold text-gray-800 dark:text-white'>
                                {mission.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='text-center'>
                            <p className='text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto'>
                                {mission.description}
                            </p>
                        </CardContent>
                    </Card>
                </motion.section>

                {/* Services Section */}
                <motion.section
                    className='mb-20 relative'
                    variants={itemVariants}
                >
                    {isAdmin && (
                        <button
                            onClick={() => setEditModalOpen('services')}
                            className='absolute top-0 right-0 p-2 text-blue-600 hover:bg-blue-50 rounded-lg z-10'
                            title='Chỉnh sửa Services'
                        >
                            <Edit className='w-5 h-5' />
                        </button>
                    )}

                    <div className='text-center mb-12'>
                        <h2 className='text-4xl font-bold text-gray-800 dark:text-white mb-4'>
                            {services.title}
                        </h2>
                        <p className='text-lg text-gray-600 dark:text-gray-300'>
                            {services.subtitle}
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                        {services.items.map((service, index) => {
                            const IconComponent =
                                serviceIcons[service.id] || Hotel;
                            return (
                                <motion.div
                                    key={service.id}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{
                                        duration: 0.2,
                                        delay: index * 0.1,
                                    }}
                                    className='group'
                                >
                                    <Card className='h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl group-hover:shadow-2xl transition-all duration-300'>
                                        <CardHeader className='text-center'>
                                            <motion.div
                                                className='flex justify-center mb-4'
                                                whileHover={{
                                                    scale: 1.2,
                                                    rotate: 5,
                                                }}
                                                transition={{ duration: 0.1 }}
                                            >
                                                <IconComponent className='w-12 h-12 text-blue-600' />
                                            </motion.div>
                                            <CardTitle className='text-xl font-semibold text-gray-800 dark:text-white'>
                                                {service.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className='text-gray-600 dark:text-gray-300 text-center'>
                                                {service.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.section>

                {/* Team Section */}
                <motion.section
                    className='mb-20 relative'
                    variants={itemVariants}
                >
                    {isAdmin && (
                        <button
                            onClick={() => setEditModalOpen('team')}
                            className='absolute top-0 right-0 p-2 text-blue-600 hover:bg-blue-50 rounded-lg z-10'
                            title='Chỉnh sửa Team'
                        >
                            <Edit className='w-5 h-5' />
                        </button>
                    )}

                    <div className='text-center mb-12'>
                        <h2 className='text-4xl font-bold text-gray-800 dark:text-white mb-4'>
                            {team.title}
                        </h2>
                        <p className='text-lg text-gray-600 dark:text-gray-300'>
                            {team.subtitle}
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
                        {team.members.map((member) => (
                            <motion.div
                                key={member.id}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.02 }}
                                className='group'
                            >
                                <Card className='h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl group-hover:shadow-2xl transition-all duration-300'>
                                    <CardHeader className='text-center'>
                                        <motion.div
                                            className='relative mx-auto mb-4'
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className='w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1'>
                                                <img
                                                    src={member.avatar}
                                                    alt={member.name}
                                                    className='w-full h-full rounded-full object-cover bg-white'
                                                />
                                            </div>
                                            <motion.div
                                                className='absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center'
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: 'linear',
                                                }}
                                            >
                                                <Star className='w-4 h-4 text-white' />
                                            </motion.div>
                                        </motion.div>
                                        <CardTitle className='text-xl font-bold text-gray-800 dark:text-white'>
                                            {member.name}
                                        </CardTitle>
                                        <CardDescription className='text-blue-600 font-semibold'>
                                            {member.role}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className='text-gray-600 dark:text-gray-300 text-center mb-6'>
                                            {member.description}
                                        </p>

                                        <div className='mb-4'>
                                            <h4 className='font-semibold text-gray-800 dark:text-white mb-2'>
                                                Chuyên môn:
                                            </h4>
                                            <div className='flex flex-wrap gap-2'>
                                                {member.skills.map(
                                                    (skill, skillIndex) => (
                                                        <span
                                                            key={skillIndex}
                                                            className='px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm'
                                                        >
                                                            {skill}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        <Separator className='my-4' />

                                        <div className='space-y-2'>
                                            <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
                                                <Mail className='w-4 h-4 mr-2' />
                                                <span className='hover:text-blue-600 transition-colors'>
                                                    {member.email}
                                                </span>
                                            </div>
                                            <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
                                                <Phone className='w-4 h-4 mr-2' />
                                                <span className='hover:text-blue-600 transition-colors'>
                                                    {member.phone}
                                                </span>
                                            </div>
                                            {member.linkedin && (
                                                <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
                                                    <Linkedin className='w-4 h-4 mr-2' />
                                                    <span className='hover:text-blue-600 transition-colors'>
                                                        LinkedIn
                                                    </span>
                                                </div>
                                            )}
                                            {member.github && (
                                                <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
                                                    <Github className='w-4 h-4 mr-2' />
                                                    <span className='hover:text-blue-600 transition-colors'>
                                                        GitHub
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Values Section */}
                <motion.section
                    className='mb-20 relative'
                    variants={itemVariants}
                >
                    {isAdmin && (
                        <button
                            onClick={() => setEditModalOpen('values')}
                            className='absolute top-0 right-0 p-2 text-blue-600 hover:bg-blue-50 rounded-lg z-10'
                            title='Chỉnh sửa Values'
                        >
                            <Edit className='w-5 h-5' />
                        </button>
                    )}

                    <div className='text-center mb-12'>
                        <h2 className='text-4xl font-bold text-gray-800 dark:text-white mb-4'>
                            {values.title}
                        </h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {values.items.map((value) => {
                            const IconComponent = valueIcons[value.id] || Award;
                            const colorClass =
                                valueColors[value.color] || valueColors.blue;

                            return (
                                <div
                                    key={value.id}
                                    className='transform transition-transform duration-300 hover:scale-105'
                                >
                                    <Card
                                        className={`text-center bg-gradient-to-br ${colorClass} text-white border-0 shadow-xl`}
                                    >
                                        <CardHeader>
                                            <IconComponent className='w-12 h-12 mx-auto mb-4' />
                                            <CardTitle>{value.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>{value.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </motion.section>

                {/* Edit Modals */}
                {editModalOpen === 'hero' && (
                    <EditModal
                        isOpen={true}
                        onClose={() => setEditModalOpen(null)}
                        title='Chỉnh sửa Hero Section'
                    >
                        <BasicSectionEdit
                            title={heroSection.title}
                            description={heroSection.description}
                            onSave={(title, description) =>
                                handleSectionEdit('hero', title, description)
                            }
                            onCancel={() => setEditModalOpen(null)}
                        />
                    </EditModal>
                )}

                {editModalOpen === 'mission' && (
                    <EditModal
                        isOpen={true}
                        onClose={() => setEditModalOpen(null)}
                        title='Chỉnh sửa Mission'
                    >
                        <BasicSectionEdit
                            title={mission.title}
                            description={mission.description}
                            onSave={(title, description) =>
                                handleSectionEdit('mission', title, description)
                            }
                            onCancel={() => setEditModalOpen(null)}
                        />
                    </EditModal>
                )}

                {editModalOpen === 'services' && (
                    <EditModal
                        isOpen={true}
                        onClose={() => setEditModalOpen(null)}
                        title='Chỉnh sửa Services'
                    >
                        <BasicSectionEdit
                            title={services.title}
                            description={services.subtitle}
                            onSave={(title, description) =>
                                handleSectionEdit(
                                    'services',
                                    title,
                                    description,
                                )
                            }
                            onCancel={() => setEditModalOpen(null)}
                        />
                    </EditModal>
                )}

                {editModalOpen === 'team' && (
                    <EditModal
                        isOpen={true}
                        onClose={() => setEditModalOpen(null)}
                        title='Quản lý Team'
                    >
                        <div className='space-y-6'>
                            <BasicSectionEdit
                                title={team.title}
                                description={team.subtitle}
                                onSave={(title, description) =>
                                    handleSectionEdit(
                                        'team',
                                        title,
                                        description,
                                    )
                                }
                                onCancel={() => setEditModalOpen(null)}
                            />
                            <Separator />
                            <TeamMemberEdit
                                members={team.members}
                                onAddMember={addTeamMember}
                                onUpdateMember={updateTeamMember}
                                onDeleteMember={deleteTeamMember}
                            />
                        </div>
                    </EditModal>
                )}
            </motion.div>
        </div>
    );
};

export default AboutPage;
