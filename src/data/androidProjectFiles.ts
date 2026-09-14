import { AndroidFile } from '../types';

export const ANDROID_PROJECT_FILES: AndroidFile[] = [
  {
    id: 'build-gradle-app',
    path: 'app/build.gradle.kts',
    fileName: 'build.gradle.kts (App)',
    language: 'kotlin',
    category: 'build',
    description: 'ملف إعدادات وبناء الموديول الأساسي مع تضمين مكتبات Compose و Room و Coil',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.pronotes.arabicapp"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.pronotes.arabicapp"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    // AndroidX & Core KTX
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)

    // Jetpack Compose BOM & UI Components (Material 3)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)

    // ViewModel & Lifecycle for Compose
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.7")

    // Navigation Compose
    implementation("androidx.navigation:navigation-compose:2.8.5")

    // Room Database (Local Persistence)
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    ksp("androidx.room:room-compiler:$roomVersion")

    // Coil for Jetpack Compose (Image Loading)
    implementation("io.coil-kt:coil-compose:2.7.0")

    // Gson (لتحويل قائمة مسارات الصور في Room)
    implementation("com.google.code.gson:gson:2.11.0")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")
}`,
  },
  {
    id: 'note-entity',
    path: 'app/src/main/java/com/pronotes/arabicapp/data/model/NoteEntity.kt',
    fileName: 'NoteEntity.kt',
    language: 'kotlin',
    category: 'data',
    description: 'كيان قاعدة البيانات Room لتمثيل الملاحظة، العنوان، المحتوى، واللون ومسارات الصور',
    code: `package com.pronotes.arabicapp.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * الكيان الأساسي للملاحظة في قاعدة بيانات Room.
 * يدعم النصوص العربية بدقة UTF-8 وتخزين قائمة مسارات الصور عبر TypeConverter.
 */
@Entity(tableName = "notes")
data class NoteEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0L,
    val title: String,
    val content: String,
    val colorId: String = "default",
    val imageUris: List<String> = emptyList(),
    val isPinned: Boolean = false,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)`,
  },
  {
    id: 'converters',
    path: 'app/src/main/java/com/pronotes/arabicapp/data/local/Converters.kt',
    fileName: 'Converters.kt',
    language: 'kotlin',
    category: 'data',
    description: 'محول الأنواع TypeConverter لتحويل List<String> إلى نصوص JSON والعكس',
    code: `package com.pronotes.arabicapp.data.local

import androidx.room.TypeConverter
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

/**
 * محول مخصص لـ Room للتعامل مع قائمة مسارات الصور (URIs)
 */
class Converters {
    private val gson = Gson()

    @TypeConverter
    fun fromStringList(value: List<String>?): String {
        return gson.toJson(value ?: emptyList<String>())
    }

    @TypeConverter
    fun toStringList(value: String?): List<String> {
        if (value.isNullOrEmpty()) return emptyList()
        val listType = object : TypeToken<List<String>>() {}.type
        return try {
            gson.fromJson(value, listType) ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }
}`,
  },
  {
    id: 'note-dao',
    path: 'app/src/main/java/com/pronotes/arabicapp/data/local/NoteDao.kt',
    fileName: 'NoteDao.kt',
    language: 'kotlin',
    category: 'data',
    description: 'واجهة DAO مع استعلامات SQL متقدمة والبحث العربي والتدفق عبر Flow',
    code: `package com.pronotes.arabicapp.data.local

import androidx.room.*
import com.pronotes.arabicapp.data.model.NoteEntity
import kotlinx.coroutines.flow.Flow

/**
 * واجهة الوصول للبيانات (Data Access Object)
 * تدعم التدفق الحي Flow لمراقبة التغييرات بشكل تفاعلي
 */
@Dao
interface NoteDao {

    // جلب الملاحظات مرتبة حسب التثبيت أولاً ثم تاريخ التعديل الأحدث
    @Query("SELECT * FROM notes ORDER BY isPinned DESC, updatedAt DESC")
    fun getAllNotes(): Flow<List<NoteEntity>>

    // البحث في عنوان أو محتوى الملاحظات باللغة العربية
    @Query("""
        SELECT * FROM notes 
        WHERE title LIKE '%' || :query || '%' 
           OR content LIKE '%' || :query || '%' 
        ORDER BY isPinned DESC, updatedAt DESC
    """)
    fun searchNotes(query: String): Flow<List<NoteEntity>>

    @Query("SELECT * FROM notes WHERE id = :id")
    suspend fun getNoteById(id: Long): NoteEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNote(note: NoteEntity): Long

    @Update
    suspend fun updateNote(note: NoteEntity)

    @Delete
    suspend fun deleteNote(note: NoteEntity)

    @Query("DELETE FROM notes WHERE id = :id")
    suspend fun deleteNoteById(id: Long)
}`,
  },
  {
    id: 'notes-database',
    path: 'app/src/main/java/com/pronotes/arabicapp/data/local/NotesDatabase.kt',
    fileName: 'NotesDatabase.kt',
    language: 'kotlin',
    category: 'data',
    description: 'قاعدة بيانات Room مع نمط Singleton وتفعيل الـ TypeConverters',
    code: `package com.pronotes.arabicapp.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.pronotes.arabicapp.data.model.NoteEntity

@Database(
    entities = [NoteEntity::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class NotesDatabase : RoomDatabase() {

    abstract fun noteDao(): NoteDao

    companion object {
        @Volatile
        private var INSTANCE: NotesDatabase? = null

        fun getDatabase(context: Context): NotesDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    NotesDatabase::class.java,
                    "pro_notes_database"
                )
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}`,
  },
  {
    id: 'note-repository',
    path: 'app/src/main/java/com/pronotes/arabicapp/data/repository/NoteRepository.kt',
    fileName: 'NoteRepository.kt',
    language: 'kotlin',
    category: 'data',
    description: 'مستودع البيانات لعزل مصدر البيانات وتسهيل الاختبارات البرمجية',
    code: `package com.pronotes.arabicapp.data.repository

import com.pronotes.arabicapp.data.local.NoteDao
import com.pronotes.arabicapp.data.model.NoteEntity
import kotlinx.coroutines.flow.Flow

interface NoteRepository {
    fun getAllNotes(): Flow<List<NoteEntity>>
    fun searchNotes(query: String): Flow<List<NoteEntity>>
    suspend fun getNoteById(id: Long): NoteEntity?
    suspend fun insertNote(note: NoteEntity): Long
    suspend fun updateNote(note: NoteEntity)
    suspend fun deleteNote(note: NoteEntity)
    suspend fun deleteNoteById(id: Long)
}

class NoteRepositoryImpl(
    private val noteDao: NoteDao
) : NoteRepository {

    override fun getAllNotes(): Flow<List<NoteEntity>> = noteDao.getAllNotes()

    override fun searchNotes(query: String): Flow<List<NoteEntity>> = 
        noteDao.searchNotes(query)

    override suspend fun getNoteById(id: Long): NoteEntity? = 
        noteDao.getNoteById(id)

    override suspend fun insertNote(note: NoteEntity): Long = 
        noteDao.insertNote(note)

    override suspend fun updateNote(note: NoteEntity) = 
        noteDao.updateNote(note)

    override suspend fun deleteNote(note: NoteEntity) = 
        noteDao.deleteNote(note)

    override suspend fun deleteNoteById(id: Long) = 
        noteDao.deleteNoteById(id)
}`,
  },
  {
    id: 'notes-viewmodel',
    path: 'app/src/main/java/com/pronotes/arabicapp/ui/viewmodel/NotesViewModel.kt',
    fileName: 'NotesViewModel.kt',
    language: 'kotlin',
    category: 'viewmodel',
    description: 'إدارة حالات الواجهة باستخدام StateFlow ومعالجة البحث والتحرير',
    code: `package com.pronotes.arabicapp.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.pronotes.arabicapp.data.model.NoteEntity
import com.pronotes.arabicapp.data.repository.NoteRepository
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class NotesUiState(
    val notes: List<NoteEntity> = emptyList(),
    val searchQuery: String = "",
    val isGridView: Boolean = true,
    val isLoading: Boolean = false,
    val selectedNote: NoteEntity? = null
)

data class NoteEditorUiState(
    val currentNoteId: Long? = null,
    val title: String = "",
    val content: String = "",
    val selectedColorId: String = "default",
    val imageUris: List<String> = emptyList(),
    val isPinned: Boolean = false,
    val isSaved: Boolean = false
)

class NotesViewModel(
    private val repository: NoteRepository
) : ViewModel() {

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _isGridView = MutableStateFlow(true)
    val isGridView: StateFlow<Boolean> = _isGridView.asStateFlow()

    private val _editorState = MutableStateFlow(NoteEditorUiState())
    val editorState: StateFlow<NoteEditorUiState> = _editorState.asStateFlow()

    @OptIn(ExperimentalCoroutinesApi::class)
    val notes: StateFlow<List<NoteEntity>> = _searchQuery
        .debounce(300L)
        .flatMapLatest { query ->
            if (query.isBlank()) {
                repository.getAllNotes()
            } else {
                repository.searchNotes(query.trim())
            }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000L),
            initialValue = emptyList()
        )

    fun onSearchQueryChanged(newQuery: String) {
        _searchQuery.value = newQuery
    }

    fun toggleViewMode() {
        _isGridView.value = !_isGridView.value
    }

    // إعداد المحرر لملاحظة جديدة أو موجودة
    fun loadNoteForEditing(noteId: Long?) {
        if (noteId == null || noteId == 0L) {
            _editorState.value = NoteEditorUiState()
        } else {
            viewModelScope.launch {
                val note = repository.getNoteById(noteId)
                note?.let {
                    _editorState.value = NoteEditorUiState(
                        currentNoteId = it.id,
                        title = it.title,
                        content = it.content,
                        selectedColorId = it.colorId,
                        imageUris = it.imageUris,
                        isPinned = it.isPinned
                    )
                }
            }
        }
    }

    fun updateEditorTitle(title: String) {
        _editorState.update { it.copy(title = title) }
    }

    fun updateEditorContent(content: String) {
        _editorState.update { it.copy(content = content) }
    }

    fun selectColor(colorId: String) {
        _editorState.update { it.copy(selectedColorId = colorId) }
    }

    fun togglePinEditor() {
        _editorState.update { it.copy(isPinned = !it.isPinned) }
    }

    fun addImages(newUris: List<String>) {
        _editorState.update { current ->
            current.copy(imageUris = (current.imageUris + newUris).distinct())
        }
    }

    fun removeImage(uri: String) {
        _editorState.update { current ->
            current.copy(imageUris = current.imageUris.filter { it != uri })
        }
    }

    fun saveCurrentNote(onSuccess: () -> Unit = {}) {
        val state = _editorState.value
        if (state.title.isBlank() && state.content.isBlank() && state.imageUris.isEmpty()) {
            return
        }

        viewModelScope.launch {
            val note = NoteEntity(
                id = state.currentNoteId ?: 0L,
                title = state.title.trim(),
                content = state.content.trim(),
                colorId = state.selectedColorId,
                imageUris = state.imageUris,
                isPinned = state.isPinned,
                updatedAt = System.currentTimeMillis()
            )

            if (state.currentNoteId == null || state.currentNoteId == 0L) {
                repository.insertNote(note)
            } else {
                repository.updateNote(note)
            }
            onSuccess()
        }
    }

    fun deleteNote(noteId: Long, onDeleted: () -> Unit = {}) {
        viewModelScope.launch {
            repository.deleteNoteById(noteId)
            onDeleted()
        }
    }

    fun togglePin(note: NoteEntity) {
        viewModelScope.launch {
            repository.updateNote(note.copy(isPinned = !note.isPinned))
        }
    }
}`,
  },
  {
    id: 'theme-color',
    path: 'app/src/main/java/com/pronotes/arabicapp/ui/theme/Color.kt',
    fileName: 'Color.kt',
    language: 'kotlin',
    category: 'theme',
    description: 'ألوان Material 3 ولوحة الألوان الباستيل المخصصة للملاحظات',
    code: `package com.pronotes.arabicapp.ui.theme

import androidx.compose.ui.graphics.Color

// الألوان الرئيسية للتطبيق (Material 3)
val PrimaryAmber = Color(0xFFE5A000)
val PrimaryDarkAmber = Color(0xFFFFB900)
val SecondaryTeal = Color(0xFF00796B)

// ألوان خلفيات الملاحظات بالوضع الفاتح (Light Mode)
val NoteDefaultLight = Color(0xFFFFFFFF)
val NoteAmberLight = Color(0xFFFFF8E1)
val NoteEmeraldLight = Color(0xFFE8F5E9)
val NoteSkyLight = Color(0xFFE3F2FD)
val NoteVioletLight = Color(0xFFF3E5F5)
val NoteRoseLight = Color(0xFFFFEBEE)
val NoteOrangeLight = Color(0xFFFBE9E7)
val NoteSlateLight = Color(0xFFECEFF1)

// ألوان خلفيات الملاحظات بالوضع الداكن (Dark Mode)
val NoteDefaultDark = Color(0xFF242529)
val NoteAmberDark = Color(0xFF382D16)
val NoteEmeraldDark = Color(0xFF193322)
val NoteSkyDark = Color(0xFF172B3C)
val NoteVioletDark = Color(0xFF2C1C35)
val NoteRoseDark = Color(0xFF3A181E)
val NoteOrangeDark = Color(0xFF351F19)
val NoteSlateDark = Color(0xFF22292E)

fun getNoteColor(colorId: String, isDark: Boolean): Color {
    return if (isDark) {
        when (colorId) {
            "amber" -> NoteAmberDark
            "emerald" -> NoteEmeraldDark
            "sky" -> NoteSkyDark
            "violet" -> NoteVioletDark
            "rose" -> NoteRoseDark
            "orange" -> NoteOrangeDark
            "slate" -> NoteSlateDark
            else -> NoteDefaultDark
        }
    } else {
        when (colorId) {
            "amber" -> NoteAmberLight
            "emerald" -> NoteEmeraldLight
            "sky" -> NoteSkyLight
            "violet" -> NoteVioletLight
            "rose" -> NoteRoseLight
            "orange" -> NoteOrangeLight
            "slate" -> NoteSlateLight
            else -> NoteDefaultLight
        }
    }
}`,
  },
  {
    id: 'theme-main',
    path: 'app/src/main/java/com/pronotes/arabicapp/ui/theme/Theme.kt',
    fileName: 'Theme.kt',
    language: 'kotlin',
    category: 'theme',
    description: 'قالب Material 3 مع فرض الاتجاه من اليمين لليسار (RTL) للغة العربية',
    code: `package com.pronotes.arabicapp.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection

private val DarkColorScheme = darkColorScheme(
    primary = PrimaryDarkAmber,
    secondary = SecondaryTeal,
    background = androidx.compose.ui.graphics.Color(0xFF131316),
    surface = androidx.compose.ui.graphics.Color(0xFF1E1F24)
)

private val LightColorScheme = lightColorScheme(
    primary = PrimaryAmber,
    secondary = SecondaryTeal,
    background = androidx.compose.ui.graphics.Color(0xFFF8F9FA),
    surface = androidx.compose.ui.graphics.Color(0xFFFFFFFF)
)

@Composable
fun ProNotesTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    // تطبيق اتجاه RTL بالكامل للغة العربية افتراضياً
    CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography = ArabicTypography,
            content = content
        )
    }
}`,
  },
  {
    id: 'notes-list-screen',
    path: 'app/src/main/java/com/pronotes/arabicapp/ui/screens/NotesListScreen.kt',
    fileName: 'NotesListScreen.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'شاشة عرض الملاحظات (List/Grid)، شريط البحث العربي، والزر العائم FAB',
    code: `package com.pronotes.arabicapp.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.staggeredgrid.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.pronotes.arabicapp.R
import com.pronotes.arabicapp.data.model.NoteEntity
import com.pronotes.arabicapp.ui.theme.getNoteColor
import com.pronotes.arabicapp.ui.viewmodel.NotesViewModel
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotesListScreen(
    viewModel: NotesViewModel,
    onNavigateToEditor: (Long?) -> Unit,
    modifier: Modifier = Modifier
) {
    val notes by viewModel.notes.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val isGridView by viewModel.isGridView.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "مذكرة زينب مسلم",
                        fontWeight = FontWeight.Bold,
                        fontSize = 22.sp
                    )
                },
                actions = {
                    IconButton(onClick = { viewModel.toggleViewMode() }) {
                        Icon(
                            imageVector = if (isGridView) Icons.Default.ViewAgenda else Icons.Default.GridView,
                            contentDescription = "تبديل طريقة العرض"
                        )
                    }
                }
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = { onNavigateToEditor(null) },
                icon = { Icon(Icons.Default.Add, contentDescription = "إضافة") },
                text = { Text("ملاحظة جديدة", fontWeight = FontWeight.SemiBold) },
                containerColor = MaterialTheme.colorScheme.primary
            )
        }
    ) { paddingValues ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // شريط البحث العربي السريع
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { viewModel.onSearchQueryChanged(it) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                placeholder = { Text("ابحث في الملاحظات أو الصور...") },
                leadingIcon = {
                    Icon(Icons.Default.Search, contentDescription = "بحث")
                },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { viewModel.onSearchQueryChanged("") }) {
                            Icon(Icons.Default.Clear, contentDescription = "مسح")
                        }
                    }
                },
                shape = RoundedCornerShape(28.dp),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = MaterialTheme.colorScheme.primary,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant
                )
            )

            if (notes.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(32.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.NoteAlt,
                            contentDescription = null,
                            modifier = Modifier.size(72.dp),
                            tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.6f)
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = if (searchQuery.isEmpty()) "لا توجد أي ملاحظات بعد" else "لم يتم العثور على نتائج للبحث",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "انقر على زر + لكتابة أول ملاحظة وحفظ أفكارك",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            } else {
                if (isGridView) {
                    // عرض شبكة متعرجة (Staggered Grid) مميزة
                    LazyVerticalStaggeredGrid(
                        columns = StaggeredGridCells.Fixed(2),
                        contentPadding = PaddingValues(16.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalItemSpacing = 12.dp,
                        modifier = Modifier.fillMaxSize()
                    ) {
                        items(notes, key = { it.id }) { note ->
                            NoteCard(
                                note = note,
                                onClick = { onNavigateToEditor(note.id) },
                                onPinClick = { viewModel.togglePin(note) }
                            )
                        }
                    }
                } else {
                    // عرض قائمة عمودية (List View)
                    LazyColumn(
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        items(notes, key = { it.id }) { note ->
                            NoteCard(
                                note = note,
                                onClick = { onNavigateToEditor(note.id) },
                                onPinClick = { viewModel.togglePin(note) }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun NoteCard(
    note: NoteEntity,
    onClick: () -> Unit,
    onPinClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isDark = androidx.compose.foundation.isSystemInDarkTheme()
    val cardBgColor = getNoteColor(note.colorId, isDark)
    val dateFormat = SimpleDateFormat("d MMMM yyyy", Locale("ar"))

    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = cardBgColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = modifier
            .fillMaxWidth()
            .clickable { onClick() }
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            // صورة مصغرة إذا كانت الملاحظة تحتوي على صور
            if (note.imageUris.isNotEmpty()) {
                AsyncImage(
                    model = note.imageUris.first(),
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(130.dp)
                        .clip(RoundedCornerShape(10.dp))
                )
                Spacer(modifier = Modifier.height(10.dp))
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (note.title.isNotBlank()) {
                    Text(
                        text = note.title,
                        fontWeight = FontWeight.Bold,
                        fontSize = 17.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.weight(1f)
                    )
                }

                if (note.isPinned) {
                    Icon(
                        imageVector = Icons.Filled.PushPin,
                        contentDescription = "مثبتة",
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier
                            .size(20.dp)
                            .clickable { onPinClick() }
                    )
                }
            }

            if (note.content.isNotBlank()) {
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = note.content,
                    style = MaterialTheme.typography.bodyMedium,
                    maxLines = 5,
                    overflow = TextOverflow.Ellipsis,
                    lineHeight = 20.sp
                )
            }

            Spacer(modifier = Modifier.height(10.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = dateFormat.format(Date(note.updatedAt)),
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f)
                )

                if (note.imageUris.size > 1) {
                    Badge(containerColor = MaterialTheme.colorScheme.surfaceVariant) {
                        Text(
                            text = "+\${note.imageUris.size - 1} صور",
                            fontSize = 10.sp
                        )
                    }
                }
            }
        }
    }
}`,
  },
  {
    id: 'note-edit-screen',
    path: 'app/src/main/java/com/pronotes/arabicapp/ui/screens/NoteEditScreen.kt',
    fileName: 'NoteEditScreen.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'واجهة تحرير الملاحظة مع التقاط الصور المتعددة بواسطة Coil ومحدد الألوان',
    code: `package com.pronotes.arabicapp.ui.screens

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.pronotes.arabicapp.ui.theme.getNoteColor
import com.pronotes.arabicapp.ui.viewmodel.NotesViewModel
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NoteEditScreen(
    noteId: Long?,
    viewModel: NotesViewModel,
    onNavigateBack: () -> Unit
) {
    LaunchedEffect(noteId) {
        viewModel.loadNoteForEditing(noteId)
    }

    val state by viewModel.editorState.collectAsState()
    val isDark = isSystemInDarkTheme()
    val bgColor = getNoteColor(state.selectedColorId, isDark)

    // ActivityResultLauncher لاختيار عدة صور من المعرض
    val galleryLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetMultipleContents()
    ) { uris: List<Uri> ->
        val uriStrings = uris.map { it.toString() }
        viewModel.addImages(uriStrings)
    }

    val colorsList = listOf("default", "amber", "emerald", "sky", "violet", "rose", "orange", "slate")

    Scaffold(
        topBar = {
            TopAppBar(
                title = {},
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "رجوع"
                        )
                    }
                },
                actions = {
                    // تثبيت الملاحظة
                    IconButton(onClick = { viewModel.togglePinEditor() }) {
                        Icon(
                            imageVector = if (state.isPinned) Icons.Filled.PushPin else Icons.Outlined.PushPin,
                            contentDescription = "تثبيت",
                            tint = if (state.isPinned) MaterialTheme.colorScheme.primary else LocalContentColor.current
                        )
                    }

                    // إرفاق صورة من المعرض
                    IconButton(onClick = { galleryLauncher.launch("image/*") }) {
                        Icon(
                            imageVector = Icons.Default.AddPhotoAlternate,
                            contentDescription = "إرفاق صورة"
                        )
                    }

                    // حذف الملاحظة إذا كانت محفوظة مسبقاً
                    if (state.currentNoteId != null) {
                        IconButton(onClick = {
                            viewModel.deleteNote(state.currentNoteId!!) {
                                onNavigateBack()
                            }
                        }) {
                            Icon(
                                imageVector = Icons.Default.DeleteOutline,
                                contentDescription = "حذف الملاحظة",
                                tint = MaterialTheme.colorScheme.error
                            )
                        }
                    }

                    // حفظ الملاحظة
                    IconButton(onClick = {
                        viewModel.saveCurrentNote {
                            onNavigateBack()
                        }
                    }) {
                        Icon(
                            imageVector = Icons.Default.Check,
                            contentDescription = "حفظ الملاحظة",
                            tint = MaterialTheme.colorScheme.primary
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = bgColor)
            )
        },
        containerColor = bgColor
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp, vertical = 12.dp)
        ) {
            // شريط اختيار لون الملاحظة (Color Palette)
            Text(
                text = "لون الملاحظة:",
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(8.dp))
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(colorsList) { colorId ->
                    val colorSample = getNoteColor(colorId, isDark)
                    val isSelected = state.selectedColorId == colorId
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(colorSample)
                            .border(
                                width = if (isSelected) 2.5.dp else 1.dp,
                                color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outlineVariant,
                                shape = CircleShape
                            )
                            .clickable { viewModel.selectColor(colorId) },
                        contentAlignment = Alignment.Center
                    ) {
                        if (isSelected) {
                            Icon(
                                imageVector = Icons.Default.Check,
                                contentDescription = null,
                                modifier = Modifier.size(18.dp),
                                tint = MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // معرض الصور المرفقة مع إمكانية الحذف
            if (state.imageUris.isNotEmpty()) {
                Text(
                    text = "الصور المرفقة (\${state.imageUris.size}):",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(8.dp))
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(state.imageUris) { uri ->
                        Box(
                            modifier = Modifier
                                .size(width = 140.dp, height = 110.dp)
                                .clip(RoundedCornerShape(12.dp))
                        ) {
                            AsyncImage(
                                model = ImageRequest.Builder(LocalContext.current)
                                    .data(uri)
                                    .crossfade(true)
                                    .build(),
                                contentDescription = "صورة الملاحظة",
                                contentScale = ContentScale.Crop,
                                modifier = Modifier.fillMaxSize()
                            )

                            // زر حذف الصورة
                            IconButton(
                                onClick = { viewModel.removeImage(uri) },
                                modifier = Modifier
                                    .align(Alignment.TopEnd)
                                    .padding(4.dp)
                                    .size(26.dp)
                                    .background(Color.Black.copy(alpha = 0.6f), CircleShape)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Close,
                                    contentDescription = "حذف الصورة",
                                    tint = Color.White,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            // حقل العنوان (Title)
            TextField(
                value = state.title,
                onValueChange = { viewModel.updateEditorTitle(it) },
                placeholder = {
                    Text(
                        text = "عنوان الملاحظة...",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)
                    )
                },
                textStyle = MaterialTheme.typography.titleLarge.copy(
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold
                ),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Color.Transparent,
                    unfocusedContainerColor = Color.Transparent,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent
                ),
                modifier = Modifier.fillMaxWidth()
            )

            HorizontalDivider(
                modifier = Modifier.padding(vertical = 4.dp),
                color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.4f)
            )

            // حقل النص الرئيسي (Body Content)
            TextField(
                value = state.content,
                onValueChange = { viewModel.updateEditorContent(it) },
                placeholder = {
                    Text(
                        text = "اكتب ملاحظتك هنا بحرية...",
                        fontSize = 16.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)
                    )
                },
                textStyle = MaterialTheme.typography.bodyLarge.copy(
                    fontSize = 16.sp,
                    lineHeight = 26.sp
                ),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Color.Transparent,
                    unfocusedContainerColor = Color.Transparent,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .defaultMinSize(minHeight = 300.dp)
            )
        }
    }
}`,
  },
  {
    id: 'main-activity',
    path: 'app/src/main/java/com/pronotes/arabicapp/MainActivity.kt',
    fileName: 'MainActivity.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'النشاط الرئيسي وإعداد Compose Navigation وتوجيه الشاشات',
    code: `package com.pronotes.arabicapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.pronotes.arabicapp.data.local.NotesDatabase
import com.pronotes.arabicapp.data.repository.NoteRepositoryImpl
import com.pronotes.arabicapp.ui.screens.NoteEditScreen
import com.pronotes.arabicapp.ui.screens.NotesListScreen
import com.pronotes.arabicapp.ui.theme.ProNotesTheme
import com.pronotes.arabicapp.ui.viewmodel.NotesViewModel
import com.pronotes.arabicapp.ui.viewmodel.NotesViewModelFactory

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val database = NotesDatabase.getDatabase(this)
        val repository = NoteRepositoryImpl(database.noteDao())

        setContent {
            ProNotesTheme {
                val navController = rememberNavController()
                val viewModel: NotesViewModel = viewModel(
                    factory = NotesViewModelFactory(repository)
                )

                NavHost(
                    navController = navController,
                    startDestination = "notes_list"
                ) {
                    composable("notes_list") {
                        NotesListScreen(
                            viewModel = viewModel,
                            onNavigateToEditor = { noteId ->
                                val route = if (noteId != null) "note_edit?noteId=$noteId" else "note_edit"
                                navController.navigate(route)
                            }
                        )
                    }

                    composable(
                        route = "note_edit?noteId={noteId}",
                        arguments = listOf(
                            navArgument("noteId") {
                                type = NavType.StringType
                                nullable = true
                                defaultValue = null
                            }
                        )
                    ) { backStackEntry ->
                        val noteIdString = backStackEntry.arguments?.getString("noteId")
                        val noteId = noteIdString?.toLongOrNull()

                        NoteEditScreen(
                            noteId = noteId,
                            viewModel = viewModel,
                            onNavigateBack = { navController.popBackStack() }
                        )
                    }
                }
            }
        }
    }
}`,
  },
  {
    id: 'android-manifest',
    path: 'app/src/main/AndroidManifest.xml',
    fileName: 'AndroidManifest.xml',
    language: 'xml',
    category: 'manifest',
    description: 'ملف بيان الأندرويد مع أذونات قراءة الوسائط وتفعيل RTL',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- أذونات قراءة الصور من المعرض -->
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission 
        android:name="android.permission.READ_EXTERNAL_STORAGE" 
        android:maxSdkVersion="32" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.ProNotesArabicApp">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.ProNotesArabicApp"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`,
  },
  {
    id: 'strings-arabic',
    path: 'app/src/main/res/values-ar/strings.xml',
    fileName: 'strings.xml (Arabic)',
    language: 'xml',
    category: 'res',
    description: 'ملف النصوص المترجمة باللغة العربية الافتراضية للتطبيق',
    code: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">مذكرة زينب مسلم</string>
    <string name="search_hint">ابحث في الملاحظات أو الصور...</string>
    <string name="new_note">ملاحظة جديدة</string>
    <string name="title_hint">عنوان الملاحظة...</string>
    <string name="body_hint">اكتب ملاحظتك هنا بحرية...</string>
    <string name="attached_images">الصور المرفقة</string>
    <string name="add_image">إرفاق صورة</string>
    <string name="delete_note">حذف الملاحظة</string>
    <string name="pin_note">تثبيت الملاحظة</string>
    <string name="save_note">حفظ</string>
    <string name="empty_notes_title">لا توجد أي ملاحظات بعد</string>
    <string name="empty_notes_desc">انقر على زر + لتدوين فكرتك الأولى وإرفاق الصور</string>
</resources>`,
  },
  {
    id: 'typography',
    path: 'app/src/main/java/com/pronotes/arabicapp/ui/theme/Type.kt',
    fileName: 'Type.kt',
    language: 'kotlin',
    category: 'theme',
    description: 'خطوط Material 3 مع ضبط الخط العربي (Cairo / Readex Pro)',
    code: `package com.pronotes.arabicapp.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// يمكن وضع ملف الخط cairo_regular.ttf في مجلد res/font
// val CairoFontFamily = FontFamily(Font(R.font.cairo_regular))

val ArabicTypography = Typography(
    titleLarge = TextStyle(
        fontWeight = FontWeight.Bold,
        fontSize = 22.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.sp
    ),
    titleMedium = TextStyle(
        fontWeight = FontWeight.SemiBold,
        fontSize = 18.sp,
        lineHeight = 24.sp
    ),
    bodyLarge = TextStyle(
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.25.sp
    ),
    bodyMedium = TextStyle(
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp
    ),
    labelSmall = TextStyle(
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp,
        lineHeight = 16.sp
    )
)`,
  }
];
