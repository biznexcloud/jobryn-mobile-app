const fs = require('fs');

function fixFile(path, replacer) {
    if (fs.existsSync(path)) {
        let content = fs.readFileSync(path, 'utf8');
        let newContent = replacer(content);
        if (content !== newContent) {
            fs.writeFileSync(path, newContent);
            console.log('Fixed', path);
        }
    }
}

fixFile('src/screens/auth/SignupScreen.tsx', content => {
    return content.replace(/'seeker' \| 'recruiter'>\('seeker'\)/g, "'job_seeker' | 'recruiter'>('job_seeker')")
                  .replace(/role === 'seeker'/g, "role === 'job_seeker'")
                  .replace(/type="seeker"/g, 'type="job_seeker"')
                  .replace(/setRole\('seeker'\)/g, "setRole('job_seeker')");
});

fixFile('src/screens/jobSeeker/StoryViewerScreen.tsx', content => {
    return content.replace(/\(_, index\)/g, "(_: any, index: number)");
});

fixFile('src/screens/jobSeeker/JobListScreen.tsx', content => {
    return content.replace(/isVisible={/g, "visible={");
});

fixFile('src/screens/auth/ProfileWizardScreen.tsx', content => {
    return content.replace(/transform:\s*\[\{\s*rotate:\s*'-15deg'\s*\}\]/g, "transform: [{ rotate: '-15deg' as any }]")
                  .replace(/transform:\s*\[\{\s*rotate:\s*'15deg'\s*\}\]/g, "transform: [{ rotate: '15deg' as any }]")
                  .replace(/transform:\s*\[\{\s*rotate:\s*'12deg'\s*\}\]/g, "transform: [{ rotate: '12deg' as any }]")
                  .replace(/transform:\s*\[\{\s*rotate:\s*'-12deg'\s*\}\]/g, "transform: [{ rotate: '-12deg' as any }]");
});

fixFile('src/screens/jobSeeker/SearchExploreScreen.tsx', content => {
    return content.replace(/transform:\s*\[\{\s*rotate:\s*'-15deg'\s*\}\]/g, "transform: [{ rotate: '-15deg' as any }]")
                  .replace(/transform:\s*\[\{\s*rotate:\s*'15deg'\s*\}\]/g, "transform: [{ rotate: '15deg' as any }]")
                  .replace(/transform:\s*\[\{\s*rotate:\s*'-12deg'\s*\}\]/g, "transform: [{ rotate: '-12deg' as any }]")
                  .replace(/transform:\s*\[\{\s*rotate:\s*'12deg'\s*\}\]/g, "transform: [{ rotate: '12deg' as any }]");
});

fixFile('src/screens/jobProvider/AnalyticsScreen.tsx', content => {
    return content.replace(/ChartBar/g, "BarChart2").replace(/UserGroup/g, "Users");
});

fixFile('src/screens/jobProvider/ApplicantDetailScreen.tsx', content => {
    return content.replace(/LocationMarker/g, "MapPin").replace(/AcademicCap/g, "GraduationCap").replace(/DotsVertical/g, "MoreVertical");
});

fixFile('src/screens/jobProvider/ProviderAboutInfoScreen.tsx', content => {
    return content.replace(/OfficeBuilding/g, "Building").replace(/UserGroup/g, "Users").replace(/GlobeAlt/g, "Globe")
                  .replace(/import\s*\{([\s\S]*?)\}\s*from\s*'react-native-heroicons\/(outline|solid)';/, "import { Pencil as PencilIcon } from 'lucide-react-native';")
                  .replace(/<Button\s+label=/g, "<Button title=");
});

fixFile('src/screens/jobSeeker/CompanyDetailScreen.tsx', content => {
    return content.replace(/<TouchableOpacity([^>]*?)mt=\{[0-9]+\}/g, "<TouchableOpacity$1");
});

fixFile('src/screens/jobSeeker/CreateSocialPostScreen.tsx', content => {
    return content.replace(/source=\{\{\s*uri:\s*user\?\.avatar\s*\}\}/g, "source={{ uri: user?.avatar || undefined }}")
                  .replace(/px=\{16\}/g, "")
                  .replace(/ml=\{8\}/g, "");
});
